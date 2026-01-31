using UnityEngine;

public class SeamlessTeleporter : MonoBehaviour
{
    [Tooltip("The airlock this teleporter belongs to or starts from.")]
    public Transform sourceAirlock;

    [Tooltip("The destination airlock where the player should appear.")]
    public Transform targetAirlock;

    [Tooltip("Offset relative to the source airlock center if the trigger isn't exactly at the center (optional).")]
    public Vector3 triggerOffset = Vector3.zero;

    public bool isActive = true;

    private Coroutine teleportCoroutine;

    private void OnTriggerEnter(Collider other)
    {
        if (!isActive) return;

        // Only teleport if obedient. If disobeyed (IsObedient == false), do nothing (allow player to proceed).
        if (!GameManager.IsObedient || AirlockManager2.Instance.IsSwitchingLevel) return;

        if (other.CompareTag("Player") && sourceAirlock != null && targetAirlock != null)
        {
            teleportCoroutine = StartCoroutine(TeleportRoutine(other.transform));
        }
    }

    private void OnTriggerExit(Collider other)
    {
        if (other.CompareTag("Player") && teleportCoroutine != null)
        {
            StopCoroutine(teleportCoroutine);
            teleportCoroutine = null;
        }
    }

    private System.Collections.IEnumerator TeleportRoutine(Transform player)
    {
        Airlock airlock = sourceAirlock.GetComponent<Airlock>();
        if (airlock != null)
        {
            // Wait for doors to close
            yield return new WaitUntil(() => airlock.frontDoor.IsFullyClosed && airlock.backDoor.IsFullyClosed);
        }

        // Play the obedient VO line before transitioning
        // Check if we're in level 5 and play the specific voice line
        int currentLevel = Events.OnSwitchSceneEvent?.CurrentScene ?? -1;
        string voClipName = (currentLevel == 4) ? "VO_LVL05_Intro02" : "VO_ObedientTransition";

        AudioManager.Instance.Play(AudioManager.Instance.voSource, voClipName);
        float voLength = AudioManager.Instance.GetCurrentVoClipLength() - 2.5f;
        if (voLength > 0f) yield return new WaitForSeconds(voLength);

        AirlockManager2.Instance.IsSwitchingLevel = true;

        // Reload the current level to reset state (Role will change to Start)
        SwitchSceneEvent evt = Events.OnSwitchSceneEvent;
        evt.NextScene = evt.CurrentScene;
        EventManager.Broadcast(evt);

        // Move player AFTER roles have been updated (so airlock is now 'Start')
        TeleportPlayer(player);

        teleportCoroutine = null;
    }

    private void TeleportPlayer(Transform playerTransform)
    {
        CharacterController cc = playerTransform.GetComponent<CharacterController>();
        if (cc != null)
        {
            cc.enabled = false;
        }

        // Calculate relative position and rotation
        Vector3 relativePos = sourceAirlock.InverseTransformPoint(playerTransform.position);
        Quaternion relativeRot = Quaternion.Inverse(sourceAirlock.rotation) * playerTransform.rotation;

        // Apply to target
        playerTransform.position = targetAirlock.TransformPoint(relativePos);
        playerTransform.rotation = targetAirlock.rotation * relativeRot;

        Physics.SyncTransforms();

        if (cc != null)
        {
            cc.enabled = true;
        }
    }

    private void OnDrawGizmos()
    {
        if (sourceAirlock != null && targetAirlock != null)
        {
            Gizmos.color = Color.green;
            Gizmos.DrawLine(transform.position, targetAirlock.position);
        }
    }
}
