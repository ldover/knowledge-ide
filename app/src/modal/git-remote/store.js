import {get} from "svelte/store";
import {getInputModal} from "../common/input/store";

/**
 *
 * @return {Modal}
 */
export function getGitRemoteModal(sGit) {
  let _sModal = getInputModal({
    options: {
      title: 'Specify remote repository',
      placeholder: 'https://github.com/user/repository'
    }
  })

  return {
    ..._sModal,
    submit: async function () {
      try {
        const remote = get(_sModal).value;

        if (!remote) {
          throw new Error('Specify remote')
        }

        await sGit.setRemote(remote);
        this.hide();
        window.alert('Remote set successfully')
      } catch (err) {
        window.alert(err)
      }
    },
  }
}

