import bigRat from 'big-rational';

export default {
	precise: function (num, digits = 2, epsilon = 0.0001) {
		if (num < epsilon && num > -epsilon) return 0;
		num = num.toPrecision(2);
		return num;
	},
};

/*
	// if (num >= 5) return Math.round(num);
	// return bigRat(num).toString();

	if (num < 10) {
		num = Math.round(num * 60);
		return '1/ ' + Math.floor(num / 60) + ':' + (num % 60) + ' min';
	}
	return Math.round(num) + '× /min';

	// // pro minute
	// //if (num >= 1) return num;
	// var sec = Math.round(60 * (1/num));

	// var min = Math.floor(sec / 60);
	// sec -= min * 60;
	// return min+':'+sec;

	// var r = bigRat(num);
	// if (r.denom == 1) return r.num;

	// return r.toString();

	// float
	// return this.toFixed(2);

	// rational or int, but with large denominators
	// const c = Math.round(1 / num);
	// if (c > 1) return '1/'+c;
	// return Math.round(num);

	// rational or int but buggy on < 1
	// const int = parseInt(num);
	// var rest = num - int;
	// if (rest < epsilon) return int;
	// if (rest > -epsilon) return int+1;
	// rest = Math.round(1 / rest);
	// return int + ' 1/' + rest;

	var r = bigRat(num);
	var denom = 0, err = 1;
	// do {
	// 	denom ++;
	// 	num = Math.round((r.numerator * denom) / r.denominator);
	// 	err = Math.abs(r.minus(num / denom));
	// }
	// while (err > epsilon);

	const aDenom = [1, 2, 3, 4, 5, 6, 10];
	for (denom of aDenom) {
		num = Math.round((r.numerator * denom) / r.denominator);
		err = Math.abs(r.minus(num / denom));
		if (err <= epsilon) break;
	};

	if (denom == 1) return num;
	return bigRat(num, denom).toString();
//*/
