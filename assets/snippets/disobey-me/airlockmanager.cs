using System.Collections.Generic;
using UnityEngine;
using Sirenix.OdinInspector;
using System.Collections;

public class AirlockManager : Manager
{
    [Title("Level Settings")]
    [SerializeField, ListDrawerSettings(ShowIndexLabels = true, DraggableItems = false)]
    private List<AirlockData> levels = new();

    [Title("Runtime Airlocks")]
    [InfoBox("Exactly 6 Airlocks are required.", InfoMessageType.Warning, "HasIncorrectAirlockCount")]
    [SerializeField, Required]
    private List<Airlock> airlocks = new();

    private bool HasIncorrectAirlockCount => airlocks == null || airlocks.Count != 6;

    private Dictionary<int, AirlockData> levelLookup;
    public bool IsSwitchingLevel { get; set; }

    private Airlock startAirlock;
    public Airlock StartAirlock => startAirlock;
    private Airlock endAirlock;

    public static AirlockManager Instance { get; private set; }

    public override void Start()
    {
        if (Instance == null)
            Instance = this;

        base.Start();
        BuildLevelLookup();
        ApplyLevelState(0);

        EventManager.AddListener<SwitchSceneEvent>(OnSwitchScene);
    }

    private void OnDestroy()
    {
        EventManager.RemoveListener<SwitchSceneEvent>(OnSwitchScene);
    }

    private void OnSwitchScene(SwitchSceneEvent evt)
    {
        IsSwitchingLevel = false;
        ApplyLevelState(evt.NextScene);
    }

    public bool GetPlayerInsideWithDoorsClosed() => endAirlock != null && endAirlock.playerIsInsideWithDoorsClosed;
    public bool GetPlayerInside() => endAirlock != null && endAirlock.playerIsInside;

    public void LoadLevel(int level)
    {
        if (IsSwitchingLevel) return;
        StartCoroutine(LoadLevelRoutine(level));
    }

    private IEnumerator LoadLevelRoutine(int level)
    {
        IsSwitchingLevel = true;

        yield return new WaitUntil(AllDoorsClosed);
        yield return new WaitForSeconds(0.5f);

        if (levelLookup.TryGetValue(level, out _))
        {
            SwitchSceneEvent evt = Events.OnSwitchSceneEvent;
            evt.NextScene = level;
            EventManager.Broadcast(evt);
            evt.CurrentScene = level;
            GameManager.IsObedient = true; // Reset obedience status for the new level
        }
        else
        {
            Debug.LogWarning($"No airlock data for level {level}");
        }

        // IsSwitchingLevel is reset in OnSwitchScene
    }

    private void BuildLevelLookup()
    {
        levelLookup = new Dictionary<int, AirlockData>(levels.Count);

        for (int i = 0; i < levels.Count; i++)
        {
            levelLookup[i] = levels[i];
        }
    }

    private void ApplyLevelState(int level)
    {
        if (!levelLookup.TryGetValue(level, out var levelData))
            return;

        ApplyActiveAirlocks(levelData);
        ApplyLevelLocks(levelData);

        if (startAirlock != null)
        {
            StartCoroutine(AutoOpenStartDoor());
        }
    }

    private IEnumerator AutoOpenStartDoor()
    {
        // Wait a frame or two to ensure Door.Start() has run and reset its state
        yield return null;
        yield return null;
        yield return new WaitUntil(() => !SceneLoadManager.IsLoading);
        if (startAirlock != null)
        {
            startAirlock.OpenFrontDoor();
        }
    }

    private void ApplyActiveAirlocks(AirlockData levelData)
    {
        // Reset airlock references for the new level state
        startAirlock = null;
        endAirlock = null;

        HashSet<int> activeSet = new(levelData.activeAirlocks);

        bool isStart = false;

        for (int i = 0; i < airlocks.Count; i++)
        {
            if (airlocks[i] == null) continue;

            bool isActive = activeSet.Contains(i);

            // Ensure all airlocks start inactive unless they are in the activeSet
            airlocks[i].gameObject.SetActive(isActive);
            airlocks[i].playerIsInsideWithDoorsClosed = false;

            // Deactivate teleporter by default
            if (airlocks[i].teleporter != null)
            {
                airlocks[i].teleporter.isActive = false;
                airlocks[i].teleporter.targetAirlock = null;
            }

            if (isActive)
            {
                if (isStart == false)
                {
                    startAirlock = airlocks[i];
                    airlocks[i].role = AirlockRole.Start;
                    isStart = true;
                }
                else
                {
                    endAirlock = airlocks[i];
                    airlocks[i].role = AirlockRole.End;
                }
            }
        }

        if (startAirlock != null && endAirlock != null)
        {
            // Start Airlock should NOT teleport (it's the entry)
            if (startAirlock.teleporter != null)
            {
                startAirlock.teleporter.targetAirlock = null;
                startAirlock.teleporter.isActive = false;
            }

            // End Airlock SHOULD teleport back to start (the loop)
            if (endAirlock.teleporter != null)
            {
                endAirlock.teleporter.targetAirlock = startAirlock.transform;
                endAirlock.teleporter.isActive = true;
            }
        }
    }

    /// <summary>
    /// Applies door states based on the INDEX within activeAirlocks,
    /// not the global airlock index.
    /// </summary>
    private void ApplyLevelLocks(AirlockData levelData)
    {
        if (levelData.activeAirlocks == null)
            return;

        int activeCount = levelData.activeAirlocks.Length;
        int stateCount = levelData.airlockDoorStates.Count;

        int count = Mathf.Min(activeCount, stateCount);

        for (int i = 0; i < count; i++)
        {
            int airlockIndex = levelData.activeAirlocks[i];

            if (airlockIndex < 0 || airlockIndex >= airlocks.Count)
            {
                Debug.LogWarning($"Invalid airlock index {airlockIndex} in level {levelData}");
                continue;
            }

            var airlock = airlocks[airlockIndex];
            if (airlock == null) continue;

            var state = levelData.airlockDoorStates[i];

            if (!airlock.gameObject.activeInHierarchy)
                continue;

            if (airlock.frontDoor != null) airlock.frontDoor.SetLockState(state.frontLocked);
            if (airlock.backDoor != null) airlock.backDoor.SetLockState(state.backLocked);
        }
    }

    private bool AllDoorsClosed()
    {
        foreach (var airlock in airlocks)
        {
            if (airlock == null || !airlock.gameObject.activeInHierarchy)
                continue;

            if (airlock.frontDoor != null && !airlock.frontDoor.IsFullyClosed) return false;
            if (airlock.backDoor != null && !airlock.backDoor.IsFullyClosed) return false;
        }
        return true;
    }

    public void UnlockEndAirlockDoor()
    {
        if (endAirlock != null && endAirlock.backDoor != null)
            endAirlock.backDoor.SetLockState(false);
    }
    public void LockEndAirlockDoor()
    {
        if (endAirlock != null && endAirlock.backDoor != null)
            endAirlock.backDoor.SetLockState(true);
    }
}

[System.Serializable]
public class AirlockData
{
    [Title("Active Airlocks (Index-based)")]
    public int[] activeAirlocks;

    [Title("Door States (Order matches Active Airlocks)")]
    [ListDrawerSettings(ShowIndexLabels = true)]
    public List<AirlockDoorState> airlockDoorStates = new();
}

[System.Serializable]
public class AirlockDoorState
{
    public bool frontLocked;
    public bool backLocked;
}
