import {get} from "svelte/store";
import {getInputModal} from "../common/input/store";

/**
 *
 * @return {Modal}
 */
export function getAccessTokenModal(sGit) {
  let _sModal = getInputModal({
    options: {
      title: `Enter GitHub access token`,
      placeholder: ''
    }
  })

  return {
    ..._sModal,
    submit: async function () {
      try {
        const accessToken = get(_sModal).value;

        if (!accessToken) {
          throw new Error('Access token not specified.')
        }

        await sGit.setAccessToken(accessToken);
        this.hide();
        window.alert('Access token set successfully')
      } catch (err) {
        window.alert(err)
      }
    },
  }
}

