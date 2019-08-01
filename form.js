



function IsDoForm(form, options) {
	base = {}

	base.Options = $.extend({}, base.Defaults, options);

	base.form = form.length == 0 ? $($('form')[0]) : $(form);
	base.history = ["clean", "clean"]; 
	base.isDirty = false; 
	base.submitting = false; 

	base.Init = function () {
		base.SetupIsDirty(); 
		base.SetupIsValid(); 
		base.SetupIsLoad(); 
	};

	base.SetupIsLoad = function () {
		//var form = $("#my-form");
		var route = base.form.data("isload-route");
		var controller = base.form.data("isload-controller");
		var id = base.form.data("isload-id");

		if (route && controller) {
			$.ajax({
				url: "/" + route + "/" + controller + "/" + id,
				type: "GET",
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				success: function (data, textStatus) {
					var d = data;
					$(".data-isload-control", base.form).each(function (i, el) {
						var field = $(el).data("isload-controller");
						$(el).val(d[field]);
					});
				},
				error: function () {
					// debugger;
				}
			});
		}
	}

	base.SetupIsValid = function () {
		base.form.on('submit', function (e) {
			console.log("Validation Init submitting", base.submitting)
			base.submitting = true;
			if (base.form[0].checkValidity() === false) {
				base.submitting = false; 
				e.preventDefault();
				e.stopPropagation();
			}
			base.form.addClass('was-validated');
		});
	}

	base.SetupIsDirty = function () {
		$(":input:not([type='checkbox']):not([type='radio'])", base.form).each(function (i, el) {
			//debugger; 
			$(el).attr("data-init-value", $(el).val());
			$(el).attr("data-formchange", "false");
		});
		$("input[type=checkbox], input[type=radio]", base.form).each(function (i, el) {
			if ($(el).is(":checked")) {
				$(el).attr("data-init-value", "checked");
			} else {
				$(el).attr("data-init-value", "unchecked");
			}
		});

		base.form.on('submit', function () {
			base.submitting = true;
			console.log("FormChangeInit submitting", base.submitting)
		});

		if (base.Options.preventLeaving) {

			$(window).on('beforeunload', function () {
				//debugger;
				console.log("Before unload submitting", base.submitting)
				if (base.isDirty && !base.submitting) {
					return base.Options.leavingMessage;
				}
			});

		};

		$(":input", base.form).change(function (i, el) {
			base.DoDirty();
		});

		$("input, textarea", base.form).on('keyup keydown blur', function (i, el) {
			base.DoDirty();
		});
	}

	base.DoDirty = function () {

		base.isDirty = false;
		$(":input:not([type='checkbox']):not([type='radio'])", base.form).each(function (i, el) {
			if ($(el).val() != $(el).attr("data-init-value")) {
				$(el).attr("data-formchange", "true");
				base.isDirty = true;
			} else {
				$(el).attr("data-formchange", "false");
			}
		});
		 $("input[type=checkbox], input[type=radio]", base.form).each(function (i, el) {
		 	if ($(el).is(":checked") && $(el).attr("data-init-value") != "checked"
		 		|| !$(el).is(":checked") && $(el).attr("data-init-value") == "checked") {
		 		$(el).attr("data-formchange", "true");
		 		base.isDirty = true;
		 	} else {
		 		$(el).attr("data-formchange", "false");
		 	}
		 });

		//console.log("isDirty", base.isDirty)
		if (base.isDirty) {
			//base.setDirty();
			base.history[0] = base.history[1];
			base.history[1] = "dirty";
		} else {
			//debugger; 
			//base.setClean();
			base.isDirty = false;
			base.history[0] = base.history[1];
			base.history[1] = "clean";		}

		//fireEvents();
		if (base.isDirty && base.history[0] == "clean") {
			base.form.trigger("dirty");
			base.onDirty();
		}
		if (!base.isDirty && this.history[0] == "dirty") {
			base.form.trigger("clean");
			base.onClean();
		}

	};

	//defaults...
	base.Options.preventLeaving = true; 
	base.Options.leavingMessage = "You have unsaved changes"; 
	base.onDirty = function () {
		$("#status").html("dirty");
		$("#save").removeAttr("disabled");
	}; 
	base.onClean = function () {
		$("#status").html("clean");
		$("#save").attr("disabled", "disabled");
	};  
	base.isDirty = false;

	
	var init = (function init() {
		base.Init(); 
		console.log("step", "Init"); 
	})()

	return base
}



(function main() {
	console.log("step", "Main");
	$.fn.isdoform = function (options) {
		IsDoForm($(this), options);
	}
})()

$(function () {
	console.log("step", "Jquery Fn");
	$.fn.isdoform = function (options) {
		IsDoForm($(this), options);
	}
})





//$("#my-form").formchange();
	$(function () {
		$("#my-form").isdoform();
	})
