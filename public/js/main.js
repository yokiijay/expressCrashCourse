document.querySelectorAll('.deleteUser').forEach((item,index)=>{
	item.onclick = ()=>{
		axios.delete('/users/delete', {
	    params: {
	      id: item.getAttribute('data-id')
	    }
	  })
	  .then(function (response) {
	    window.location.replace('/')
	  })
	  .catch(function (error) {
	    console.log(error)
	  })
	}
})