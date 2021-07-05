<template>
	<div id="convert">
		<div><textarea v-model="text"></textarea></div>
		<div><button @click="text = convert(text)">Convert</button></div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			text: `Cable
2 × Wire.png
Wire

60 / min
Constructor
2 sec
Manual crafting.png × 1
1 × Cable.png
Cable

30 / min
8 MJ / item	Tier 0 - HUB Upgrade 2
Coated Cable
ALTERNATE
5 × Wire.png
Wire

37.5 / min
2 × Heavy Oil Residue.png
Heavy Oil Residue

15 / min
Refinery
8 sec
9 × Cable.png
Cable

67.5 / min
26.67 MJ / item	Tier 5 - Oil Processing
Insulated Cable
ALTERNATE
9 × Wire.png
Wire

45 / min
6 × Rubber.png
Rubber

30 / min
Assembler
12 sec
20 × Cable.png
Cable

100 / min
9 MJ / item	Tier 5 - Oil Processing
Quickwire Cable
ALTERNATE
3 × Quickwire.png
Quickwire

7.5 / min
2 × Rubber.png
Rubber

5 / min
Assembler
24 sec
11 × Cable.png
Cable

27.5 / min
32.73 MJ / item	Tier 5 - Oil Processing
Caterium Research - Caterium Ing`,
		};
	},
	methods: {

		convert(value) {
			const makeId = (str) => {
				switch (str) {
					case 'Constructor': str = 'construct'; break;
				}
				return str.charAt(0).toLowerCase() + str.substring(1).replace(/\s+/g, '')
			};
			const aResult = [];

			value = value.replace(/\s*[\n\r]+/g, ';')+';';
			const
				a = '[\\w ]+',
				n = '[\\d\\.]+',
				rest = `[^;]*;`,
				item = `${n} × ${a}\\.png;${a};${n} / min;`;

			const pattern =
				`(${a});`+ 						//Coated Cable;
				`(ALTERNATE;)?`+ 			//ALTERNATE;
				`((?:${item})+)`+ 		//5 × Wire.png;Wire;37.5 / min;2 × Heavy Oil Residue.png;Heavy Oil Residue;15 / min;
				`(${a});(${n}) sec;`+	//Refinery;8 sec;
				`(?:Manual crafting\\.png × ${n};)?`+
				`((?:${item})+)`+			//9 × Cable.png;Cable;67.5 / min;
				`(${n}) MJ / item\t`+	//26.67 MJ / item	Tier 5 - Oil Processing
				`(?:Tier (\\d+))?${rest}`+ //	Tier 7 - Bauxite Refinement
				`((?:${item})+)`;			//1 × Computer.png;Computer;1.25 / min;

			const oRegAll = new RegExp(pattern, 'g');
			const oRegItem = new RegExp(`${n} × (${a})\\.png;${a};(${n}) / min;`, 'g');
			//$dump(oRegEx);
			let aMatch;
			while ((aMatch = oRegAll.exec(value))) {
				//$dump(aMatch);
				const [, receipeName, alt, ingredients, building, time, products, energy, tier, extra] = aMatch;

				const aIn = [], aOut = [];
				while ((aMatch = oRegItem.exec(ingredients+extra))) {
					//$dump(aMatch);
					const [, item, count] = aMatch;
					aIn.push(makeId(item)+': '+count);
				}
				while ((aMatch = oRegItem.exec(products))) {
					//$dump(aMatch);
					const [, item, count] = aMatch;
					aOut.push(makeId(item)+': '+count);
				}

				// steelRotor: ['assembler', 'Stahl Rotor', {rotor:5}, {steelPipe:10, wire:30} ],
				aResult.push(
					`${makeId(receipeName)}: [`+
						`'${makeId(building)}', `+
						`'${receipeName}', `+
						`{${aOut.join(', ')}}, `+
						`{${aIn.join(', ')}}, `+
						`${alt ? 'true' : 'false'}, `+
						`${time}, `+
						`${energy}, `+
						`${tier}, `+
					`],`
				);
			}
			//return value;
			return aResult.join("\n");
		}
	}
}
</script>

<style>
#convert {
	background: white;
	border: solid 0.5px black;
	padding: 0.5em;
}
</style>
