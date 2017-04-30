$('body').load('/short', ()=>{
	$.ajax({
		url: '/short',
		type: 'GET',
		dataType: 'JSON',
		success: (data)=>{
			var result = {
				original: data.Original;
				short: data.short;
			}
		}
	})
})