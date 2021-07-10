export default {
	name: "Wrap",
	functional: true,
	props: {
		each: String,
		replace: Boolean,
		force: Boolean,
	},
	render: function (createElement, ctx) {
		const ret = [];
		const each = ctx.props.each;

		const tmpl = ctx.slots().each;
		const tmplEls = { before: [], after: [], default: [] };
		var trg = "before";
		if (tmpl)
			tmpl.forEach((el) => {
				if (el.tag == "each") {
					tmplEls.default = el.children;
					trg = "after";
				} else tmplEls[trg].push(el);
			});
		//console.log(tmpl, tmplEls)

		ctx.slots().default.forEach((el) => {
			var childs = [el];
			const tag = el.componentOptions ? el.componentOptions.tag : el.tag;
			const isText = !tag;
			const isSame = !isText && tag == each;
			const doStrip = ctx.props.replace;
			const doWrap = ctx.props.replace || ctx.props.force || !isSame;
			//console.log(el, tag, isText, isSame, doStrip, doWrap)

			if (doStrip) {
				if (el.children) childs = el.children;
				else if (el.text) childs = [el.text.trim()];
			}

			if (doWrap) {
				if (tmpl) {
					if (!el.children) el.children = tmplEls.default;
					childs = [...tmplEls.before, ...childs, ...tmplEls.after];
				}
				childs = createElement(each, {}, childs);
			}

			ret.push(childs);
		});
		return ret;
	},
};
