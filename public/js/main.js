M.Sidenav.init(document.querySelector('.sidenav'))
M.FormSelect.init(document.querySelector('#status'))

const delete_btn = document.getElementById('delete_btn')

delete_btn.addEventListener('click', (e) => {
  e.preventDefault()
  console.log(delete_btn.value)

  let url = `/blogs/${delete_btn.value}`
  const deleteData = async (url) => {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
    return response // parses JSON response into native JavaScript objects
  }

  swal({
    title: 'Are you sure?',
    text: 'Once deleted, you will not be able to recover this blog!',
    icon: 'warning',
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      deleteData(url)

      swal('Poof! Your blog has been deleted!', {
        icon: 'success',
      }).then(() => {
        location.reload()
      })
    } else {
      swal('Your blog is safe!')
    }
  })
})
