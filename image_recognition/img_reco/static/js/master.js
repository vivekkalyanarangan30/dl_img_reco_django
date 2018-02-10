$(document).ready( function() {
	$("#pred_response").hide();
	$("#error_div").hide();
	
    	$(document).on('change', '.btn-file :file', function() {
		var input = $(this),
			label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
		input.trigger('fileselect', [label]);
		});

		$('.btn-file :file').on('fileselect', function(event, label) {
		    
		    var input = $(this).parents('.input-group').find(':text'),
		        log = label;
		    
		    if( input.length ) {
		        input.val(log);
		    } else {
		        if( log ) alert(log);
		    }
	    
		});
		function readURL(input) {
		    if (input.files && input.files[0]) {
		        var reader = new FileReader();
		        
		        reader.onload = function (e) {
		            $('#img-upload').attr('src', e.target.result);
		        }
		        
		        reader.readAsDataURL(input.files[0]);
		    }
		}
		
		function scroll_to_predict() {
			$('html, body').animate({
				scrollTop: $('#tf_predict').offset().top
			}, 'slow', function() { 
				$('#tf_predict').focus(); 
			});
		}

		$("#imgInp").change(function(){
		    readURL(this);
			$("#pred_response").show();
			scroll_to_predict();
			$("#error_div").hide();
		}); 
		
		$("#imgForm").submit(function (e){
			e.preventDefault();
			file = $('#imgInp')[0].files[0];
			var myFormData = new FormData($(this)[0]);
			var csrftoken = Cookies.get('csrftoken');
			myFormData.append('csrfmiddlewaretoken', csrftoken);
			$.ajax({
				type: $(this).attr('method'),
				url: $(this).attr('action'),
				enctype: $(this).attr('enctype'),
				headers: { "X-CSRFToken": '{{csrf_token}}' },
				processData: false,
				contentType: false,
				data: myFormData, //$(this).serialize(),
				success: function(data) {
					console.log(data)
					resp = JSON.parse(data);
					perc_prob = resp.water * 100;
					perc_prob = perc_prob.toFixed(2)
					value = perc_prob.toString()+'%'
					$('#progress_bar').text(value); 
					$('#progress_bar').attr("style","width:"+value); 
					$("#error_div").hide();
				},
				error: function(xhr, textStatus, errorThrown) {
					$("#error_div").show();
					$("#error_message").text(errorThrown+'\t'+xhr.status+'. Please contact <Team Name>');
					$('#progress_bar').text('0%'); 
					$('#progress_bar').attr("style","width: 0%"); 
				}
			});
			return false;
		});
	});