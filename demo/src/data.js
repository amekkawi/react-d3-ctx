"use strict";

export const simplePoints = [
	{
		name: 'Alpha',
		strokeWidth: 2,
		values: [
			{ x: 0, y: 0 },
			{ x: 1, y: 30 },
			{ x: 2, y: 60 },
			{ x: 3, y: 150 },
			{ x: 4, y: 30 },
			{ x: 5, y: 60 },
			{ x: 6, y: 150 }
		]
	},
	{
		name: 'Beta',
		values: [
			{ x: 0, y: 13 },
			{ x: 1, y: 20 },
			{ x: 2, y: 80 },
			{ x: 3, y: 20 },
			{ x: 4, y: 30 },
			{ x: 5, y: 20 },
			{ x: 6, y: 80 },
			{ x: 7, y: 20 }
		]
	}
];

const baseArr = Array.apply(null, Array(91)).map(Number.prototype.valueOf, 0);
export const randomPoints = [
	{
		name: 'Alpha',
		values: baseArr.map((v, i) => ({
			x: i,
			y: i === 0 ? 0 : i === 89 ? 50 : Math.random() * 50
		}))
	},
	{
		name: 'Beta',
		values: baseArr.map((v, i) => ({
			x: i,
			y: Math.random() * 50
		}))
	},
	{
		name: 'Gamma',
		values: baseArr.map((v, i) => ({
			x: i,
			y: Math.random() * 50
		}))
	}
];
