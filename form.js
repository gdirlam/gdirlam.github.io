function FormChange(form, options) {
	base = {}

	base.Options = $.extend({}, base.Defaults, options);
	//debugger; 
	base.form = form.length == 0 ? $($('form')[0] ) : $(form) ;
	base.history = ["clean", "clean"]; 
	base.isDirty = false; 
	base.Init = function () {
		//debugger; 
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
		});

		if (base.Options.preventLeaving) {

			$(window).on('beforeunload', function () {
				if (base.isDirty && !base.submitting ) {
					return base.Options.leavingMessage;
				}
			});

		};

		$(":input", base.form).change(function (i, el) {
			base.checkValues();
		});

		$("input, textarea", base.form).on('keyup keydown blur', function (i, el) {
			base.checkValues();
		});

	};

	base.checkValues = function () {

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
		//debugger; 
		if (base.isDirty) {
			base.setDirty();
		} else {
			//debugger; 
			base.setClean();
		}

		this.fireEvents();
	};

	base.fireEvents = function () {
		if (base.isDirty && base.history[0] == "clean") {
			base.form.trigger("dirty");
			base.onDirty()
		}
		if (!base.isDirty && this.history[0] == "dirty") {
			base.form.trigger("clean");
			base.onClean()
		}
	};

	base.setDirty = function () {
		base.history[0] = base.history[1];
		base.history[1] = "dirty";
	};

	base.setClean = function () {
		//debugger; 
		base.isDirty = false;
		base.history[0] = base.history[1];
		base.history[1] = "clean";
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
	$.fn.formchange = function (options) {
		FormChange($(this), options);
	}
})()
$(function () {
	console.log("step", "Jquery Fn");
	$.fn.formchange = function (options) {
		FormChange($(this), options);
	}
})





//$("#my-form").formchange();
	$(function () {
		$("#my-form").formchange();
	})
