import {get} from "svelte/store";
import {VFile} from "vfile";
import {getMultipleInputModal} from "../common/multiple-input/store";

/**
 *
 * @return {Modal}
 */
export function getGitUserModal(sGit) {
  let _sModal = getMultipleInputModal([
      {
        label: 'Git username',
        value:  localStorage.getItem('user.name') || null,
        id: 'user'
      },
      {
        label: 'Email',
        value:  localStorage.getItem('user.email') || null,
        id: 'email'
      }
    ],
    {
      title: 'Enter Git username and email',
      submitText: 'Save',
    }
  )

  return {
    ..._sModal,
    submit: async function () {
      try {
        const inputs = get(_sModal).inputs;
        const user = inputs.find(input => input.id === 'user').value;
        const email = inputs.find(input => input.id === 'email').value;

        if (!user || !email) {
          throw new Error('Invalid git user and email.')
        }

        await sGit.setConfig({
          user,
          email
        });
        window.alert('Git user saved')
        this.hide();
      } catch (err) {
        window.alert(err)
      }
    },
  }
}

