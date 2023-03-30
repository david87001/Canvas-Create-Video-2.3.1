//pi
var dddPI = 3.141592653589793;

//數學函數相關
	//向量內積
function dddDotProduct_3x1_3x1(Matrix_3x1_1, Matrix_3x1_2) {
	return (Matrix_3x1_1[0] * Matrix_3x1_2[0] + Matrix_3x1_1[1] * Matrix_3x1_2[1] + Matrix_3x1_1[2] * Matrix_3x1_2[2]);
}
	//矩陣3*3 和3*1 互相作用
function dddMatrix_3x3_3x1(Matrix_3x3, Matrix_3x1) {
	let a, b, c
	a = Matrix_3x3[0][0] * Matrix_3x1[0] + Matrix_3x3[0][1] * Matrix_3x1[1] + Matrix_3x3[0][2] * Matrix_3x1[2];
	b = Matrix_3x3[1][0] * Matrix_3x1[0] + Matrix_3x3[1][1] * Matrix_3x1[1] + Matrix_3x3[1][2] * Matrix_3x1[2];
	c = Matrix_3x3[2][0] * Matrix_3x1[0] + Matrix_3x3[2][1] * Matrix_3x1[1] + Matrix_3x3[2][2] * Matrix_3x1[2];
	return [a, b, c];
};

	//矩陣3*3 和3*3 互相作用
function dddMatrix_3x3_3x3(Matrix_3x3_1, Matrix_3x3_2) {
	let a, b, c
	a = Matrix_3x3_1[0][0] * Matrix_3x3_2[0][0] + Matrix_3x3_1[0][1] * Matrix_3x3_2[1][0] + Matrix_3x3_1[0][2] * Matrix_3x3_2[2][0];
	b = Matrix_3x3_1[0][0] * Matrix_3x3_2[0][1] + Matrix_3x3_1[0][1] * Matrix_3x3_2[1][1] + Matrix_3x3_1[0][2] * Matrix_3x3_2[2][1];
	c = Matrix_3x3_1[0][0] * Matrix_3x3_2[0][2] + Matrix_3x3_1[0][1] * Matrix_3x3_2[1][2] + Matrix_3x3_1[0][2] * Matrix_3x3_2[2][2];
	let d, e, f
	d = Matrix_3x3_1[1][0] * Matrix_3x3_2[0][0] + Matrix_3x3_1[1][1] * Matrix_3x3_2[1][0] + Matrix_3x3_1[1][2] * Matrix_3x3_2[2][0];
	e = Matrix_3x3_1[1][0] * Matrix_3x3_2[0][1] + Matrix_3x3_1[1][1] * Matrix_3x3_2[1][1] + Matrix_3x3_1[1][2] * Matrix_3x3_2[2][1];
	f = Matrix_3x3_1[1][0] * Matrix_3x3_2[0][2] + Matrix_3x3_1[1][1] * Matrix_3x3_2[1][2] + Matrix_3x3_1[1][2] * Matrix_3x3_2[2][2];
	let g, h, i
	g = Matrix_3x3_1[2][0] * Matrix_3x3_2[0][0] + Matrix_3x3_1[2][1] * Matrix_3x3_2[1][0] + Matrix_3x3_1[2][2] * Matrix_3x3_2[2][0];
	h = Matrix_3x3_1[2][0] * Matrix_3x3_2[0][1] + Matrix_3x3_1[2][1] * Matrix_3x3_2[1][1] + Matrix_3x3_1[2][2] * Matrix_3x3_2[2][1];
	i = Matrix_3x3_1[2][0] * Matrix_3x3_2[0][2] + Matrix_3x3_1[2][1] * Matrix_3x3_2[1][2] + Matrix_3x3_1[2][2] * Matrix_3x3_2[2][2];
	return [[a, b, c], [d, e, f], [g, h, i]];
};

	//所有矩陣
function dddAnyMatrix(a, b, c, d, e, f, g, h, i, Matrix) {
	let dddAnyMatrix_Matrix = [];
	let Stretch = [
		[a, b, c],
		[d, e, f],
		[g, h, i]
	]
	for (let dddAnyMatrix_i = 0; dddAnyMatrix_i < Matrix.length; dddAnyMatrix_i++) {
		dddAnyMatrix_Matrix.push(dddMatrix_3x3_3x1(Stretch, Matrix[dddAnyMatrix_i]))
	};
	return dddAnyMatrix_Matrix;
}

	//X軸旋轉矩陣
function dddRotate_X(theta, Matrix) {
	let dddRotate_X_Matrix = [];
	let rotate_X = [
		[1, 0, 0],
		[0, Math.cos(theta), Math.sin(theta)],
		[0, -Math.sin(theta), Math.cos(theta)]
	];
	for (let dddRotate_X_i = 0; dddRotate_X_i < Matrix.length; dddRotate_X_i++) {
		dddRotate_X_Matrix.push(dddMatrix_3x3_3x1(rotate_X, Matrix[dddRotate_X_i]))
	};
	return dddRotate_X_Matrix;
}

	//Y軸旋轉矩陣
function dddRotate_Y(theta, Matrix) {
	let dddRotate_Y_Matrix = [];
	let rotate_Y = [
		[Math.cos(theta), 0, Math.sin(theta)],
		[0, 1, 0],
		[-Math.sin(theta), 0, Math.cos(theta)]
	]
	for (let dddRotate_Y_i = 0; dddRotate_Y_i < Matrix.length; dddRotate_Y_i++) {
		dddRotate_Y_Matrix.push(dddMatrix_3x3_3x1(rotate_Y, Matrix[dddRotate_Y_i]))
	};
	return dddRotate_Y_Matrix;
}

	//Z軸旋轉矩陣
function dddRotate_Z(theta, Matrix) {
	let dddRotate_Z_Matrix = [];
	let rotate_Z = [
		[Math.cos(theta), Math.sin(theta), 0],
		[-Math.sin(theta), Math.cos(theta), 0],
		[0, 0, 1]
	]
	for (let dddRotate_Z_i = 0; dddRotate_Z_i < Matrix.length; dddRotate_Z_i++) {
		dddRotate_Z_Matrix.push(dddMatrix_3x3_3x1(rotate_Z, Matrix[dddRotate_Z_i]))
	};
	return dddRotate_Z_Matrix;
}

	//拉伸矩陣
function dddStretch(x,y,z,Matrix) {
	let dddStretch_Matrix = [];
	let Stretch = [
		[x, 0, 0],
		[0, y, 0],
		[0, 0, z]
	]
	for (let dddStretch_i = 0; dddStretch_i < Matrix.length; dddStretch_i++) {
		dddStretch_Matrix.push(dddMatrix_3x3_3x1(Stretch, Matrix[dddStretch_i]))
	};
	return dddStretch_Matrix;
}

	//偏移
function dddTranslation(x, y, z, Matrix){
	let dddTranslation_Matrix = Matrix;
	for (let dddTranslation_i = 0; dddTranslation_i < Matrix.length; dddTranslation_i++) {
		dddTranslation_Matrix[dddTranslation_i][0] = Matrix[dddTranslation_i][0] + x;
		dddTranslation_Matrix[dddTranslation_i][1] = Matrix[dddTranslation_i][1] + y;
		dddTranslation_Matrix[dddTranslation_i][2] = Matrix[dddTranslation_i][2] + z;
	}
	return dddTranslation_Matrix;
}

	//向量歸一化
function dddNormalize(Matrix) {
	let NormalizeParameter = 0
	for (let dddNormalize_i = 0; dddNormalize_i < Matrix.length; dddNormalize_i++) {
		NormalizeParameter = NormalizeParameter + Matrix[dddNormalize_i] ** 2
	}
	NormalizeParameter = NormalizeParameter ** (1 / 2)
	for (let dddNormalize_i = 0; dddNormalize_i < Matrix.length; dddNormalize_i++) {
		Matrix[dddNormalize_i] = Matrix[dddNormalize_i] / NormalizeParameter
	}
	return Matrix;
}

//模組相關
	//合併模型
function dddCombineDonut(Donut1, DonutSurface1, DonutNormal1, Donut2, DonutSurface2, DonutNormal2) {

	let a = Donut1.length;
	let b = DonutSurface1.length;
	for (let dddCombineDonut_i = 0; dddCombineDonut_i < DonutSurface2.length; dddCombineDonut_i++) {
		for (let dddCombineDonut_j = 0; dddCombineDonut_j < DonutSurface2[dddCombineDonut_i].length; dddCombineDonut_j++) {
			DonutSurface2[dddCombineDonut_i][dddCombineDonut_j] = DonutSurface2[dddCombineDonut_i][dddCombineDonut_j] + Donut1.length;
		}
	}
	for (let dddCombineDonut_i = 0; dddCombineDonut_i < Donut2.length; dddCombineDonut_i++) {
		Donut1[a + dddCombineDonut_i] = Donut2[dddCombineDonut_i];
	}
	for (let dddCombineDonut_ii = 0; dddCombineDonut_ii < DonutSurface2.length; dddCombineDonut_ii++) {
		console.log(DonutSurface2[dddCombineDonut_ii])
		DonutSurface1[b + dddCombineDonut_ii] = DonutSurface2[dddCombineDonut_ii];
		DonutNormal1[b + dddCombineDonut_ii] = DonutNormal2[dddCombineDonut_ii];
	}
}

	//取亮度
function dddGetLuminance(Light, Normal) {
	let BrightnessArray = [];
	for (let dddGetLuminance_i = 0; dddGetLuminance_i < Normal.length; dddGetLuminance_i++) {
		BrightnessArray[dddGetLuminance_i] = (dddDotProduct_3x1_3x1(Normal[dddGetLuminance_i], Light));
	}
	return BrightnessArray
}

	//圖層順序
function dddAnimationDrawSequence(Donut, DonutSurface) {
	let dddADS_lighthouse = [];
	for (let dddAnimationDrawSequence_i = 0; dddAnimationDrawSequence_i < DonutSurface.length; dddAnimationDrawSequence_i++) {
		dddADS_lighthouse.push(dddAnimationDrawSequence_i);
	}
	console.log(DonutSurface)
	for (let dddAnimationDrawSequence_i = 0; dddAnimationDrawSequence_i < DonutSurface.length; dddAnimationDrawSequence_i++) {
		let c = dddAnimationDrawSequence_i
		for (let dddAnimationDrawSequence_j = (dddAnimationDrawSequence_i + 1); dddAnimationDrawSequence_j < DonutSurface.length; dddAnimationDrawSequence_j++) {
			let a = [0,0,0]
			let b = [0,0,0]

			for (let dddAnimationDrawSequence_k = 0; dddAnimationDrawSequence_k < DonutSurface[dddADS_lighthouse[c]].length ; dddAnimationDrawSequence_k++) {
				a[0] = a[0] + Donut[DonutSurface[dddADS_lighthouse[c]][dddAnimationDrawSequence_k]][0];
				a[1] = a[1] + Donut[DonutSurface[dddADS_lighthouse[c]][dddAnimationDrawSequence_k]][1];
				a[2] = a[2] + Donut[DonutSurface[dddADS_lighthouse[c]][dddAnimationDrawSequence_k]][2];
			}
			[a[0],a[1],a[2]] = [a[0]/DonutSurface[dddADS_lighthouse[c]].length,a[1]/DonutSurface[dddADS_lighthouse[c]].length,a[2]/DonutSurface[dddADS_lighthouse[c]].length]
			for (let dddAnimationDrawSequence_k = 0; dddAnimationDrawSequence_k < DonutSurface[dddADS_lighthouse[dddAnimationDrawSequence_j]].length; dddAnimationDrawSequence_k++) {
				b[0] = b[0] + Donut[DonutSurface[dddADS_lighthouse[dddAnimationDrawSequence_j]][dddAnimationDrawSequence_k]][0];
				b[1] = b[1] + Donut[DonutSurface[dddADS_lighthouse[dddAnimationDrawSequence_j]][dddAnimationDrawSequence_k]][1];
				b[2] = b[2] + Donut[DonutSurface[dddADS_lighthouse[dddAnimationDrawSequence_j]][dddAnimationDrawSequence_k]][2];
			}
			[b[0], b[1], b[2]] = [b[0] / DonutSurface[dddADS_lighthouse[dddAnimationDrawSequence_j]].length, b[1] / DonutSurface[dddADS_lighthouse[dddAnimationDrawSequence_j]].length, b[2] / DonutSurface[dddADS_lighthouse[dddAnimationDrawSequence_j]].length]
			if ((a[0] ** 2 + a[1] ** 2 + (a[2] - 2000) ** 2)
				>=
				(b[0] ** 2 + b[1] ** 2 + (b[2] - 2000) ** 2)) {
				c = dddAnimationDrawSequence_j;
			}
		}
		[dddADS_lighthouse[dddAnimationDrawSequence_i], dddADS_lighthouse[c]] = [dddADS_lighthouse[c], dddADS_lighthouse[dddAnimationDrawSequence_i]];
	}
	return dddADS_lighthouse;
}

	//已存在的模型
		//甜甜圈模型
function dddCreate_Donut(r1, r2, density) {
	let dddCreate_Donut_Array = [];
	for (let dddCreate_Donut_i = 0; dddCreate_Donut_i < density; dddCreate_Donut_i++) {
		let point = [r2 + r1 * Math.cos((2 * Math.PI * dddCreate_Donut_i) / density), r1 * Math.sin((2 * Math.PI * dddCreate_Donut_i) / density), 0]
		for (let dddCreate_Donut_j = 0; dddCreate_Donut_j < density; dddCreate_Donut_j++) {
			let rotate_Y = [
				[Math.cos((2 * Math.PI * dddCreate_Donut_j) / density), 0, Math.sin((2 * Math.PI * dddCreate_Donut_j) / density)],
				[0, 1, 0],
				[-Math.sin((2 * Math.PI * dddCreate_Donut_j) / density), 0, Math.cos((2 * Math.PI * dddCreate_Donut_j) / density)]
			]
			dddCreate_Donut_Array.push(dddMatrix_3x3_3x1(rotate_Y, point))
		}
	};
	return dddCreate_Donut_Array;
}
function dddCreate_DonutSurface(density) {
	let dddCreate_DonutSurface_Array = [];
	for (let dddCreate_DonutSurface_i = 0; dddCreate_DonutSurface_i < density; dddCreate_DonutSurface_i++) {
		for (let dddCreate_DonutSurface_j = 0; dddCreate_DonutSurface_j < density; dddCreate_DonutSurface_j++) {
			let a = density * dddCreate_DonutSurface_i + dddCreate_DonutSurface_j;
			let b = a + 1;
			if (b % density === 0) {
				b = b - density;
			}
			let c = a + density;
			if (c % density === 0) {
				c = a + density;
			}
			let d = c + 1;
			if (d % density === 0) {
				d = d - density;
			}
			if (a >= (density * density)) {
				a = a % (density * density);
			}
			if (b >= (density * density)) {
				b = b % (density * density);
			}
			if (c >= (density * density)) {
				c = c % (density * density);
			}
			if (d >= (density * density)) {
				d = d % (density * density);
			}
			dddCreate_DonutSurface_Array.push([a, b, d, c])
		}
	}
	return dddCreate_DonutSurface_Array;
}
function dddCreate_DonutNormal(density) {
	let dddCreate_DonutNormal_Array = [];
	for (let dddCreate_DonutNormal_i = 0; dddCreate_DonutNormal_i < density; dddCreate_DonutNormal_i++) {
		let point = [Math.cos((2 * Math.PI * dddCreate_DonutNormal_i) / density), Math.sin((2 * Math.PI * dddCreate_DonutNormal_i) / density), 0]
		for (let dddCreate_DonutNormal_j = 0; dddCreate_DonutNormal_j < density; dddCreate_DonutNormal_j++) {
			let rotate_Y = [
				[Math.cos((2 * Math.PI * dddCreate_DonutNormal_j) / density), 0, Math.sin((2 * Math.PI * dddCreate_DonutNormal_j) / density)],
				[0, 1, 0],
				[-Math.sin((2 * Math.PI * dddCreate_DonutNormal_j) / density), 0, Math.cos((2 * Math.PI * dddCreate_DonutNormal_j) / density)]
			]
			dddCreate_DonutNormal_Array.push(dddMatrix_3x3_3x1(rotate_Y, point))
		}
	};
	return dddCreate_DonutNormal_Array;
}

		//柱體模型
function dddCreate_Prism(r1, density){
	let dddCreate_Prism_Array = [];
	for (let dddCreate_Prism_i = 0; dddCreate_Prism_i < density; dddCreate_Prism_i++) {
		dddCreate_Prism_Array.push([r1 * Math.cos((2 * Math.PI * dddCreate_Prism_i) / density), r1 * Math.sin((2 * Math.PI * dddCreate_Prism_i) / density),r1])
	}
	for (let dddCreate_Prism_i = 0; dddCreate_Prism_i < density; dddCreate_Prism_i++) {
		dddCreate_Prism_Array.push([r1 * Math.cos((2 * Math.PI * dddCreate_Prism_i) / density), r1 * Math.sin((2 * Math.PI * dddCreate_Prism_i) / density), -r1])
	}
	return dddCreate_Prism_Array;
}
function dddCreate_PrismSurface(density){
	let dddCreate_PrismSurface_Array = [];
	for (let dddCreate_PrismSurface_i = 0; dddCreate_PrismSurface_i < density; dddCreate_PrismSurface_i++) {
		let a = dddCreate_PrismSurface_i
		let b = dddCreate_PrismSurface_i + 1
		if (b % density === 0){
			b = b - density;
		}
		let c = a + density
		let d = c + 1
		if (d % density === 0) {
			d = d - density;
		}
		dddCreate_PrismSurface_Array.push([a,b,d,c]);
	}
	let Array1 = []
	let Array2 = []
	for (let dddCreate_PrismSurface_i = 0; dddCreate_PrismSurface_i < density; dddCreate_PrismSurface_i++) {
		Array1.push(dddCreate_PrismSurface_i)
		Array2.push(dddCreate_PrismSurface_i + density)
	}
	dddCreate_PrismSurface_Array.push(Array1);
	dddCreate_PrismSurface_Array.push(Array2);
	return dddCreate_PrismSurface_Array;
}
function dddCreate_PrismNormal(density){
	let dddCreate_PrismNormal_Array = [];
	for (let dddCreate_PrismNormal_i = 0; dddCreate_PrismNormal_i < density; dddCreate_PrismNormal_i++) {
		dddCreate_PrismNormal_Array.push([Math.cos((2 * Math.PI * dddCreate_PrismNormal_i) / density), Math.sin((2 * Math.PI * dddCreate_PrismNormal_i) / density),0])
	}
	dddCreate_PrismNormal_Array.push([0,0,1]);
	dddCreate_PrismNormal_Array.push([0,0,-1]);
	return dddCreate_PrismNormal_Array;
}

		//方塊模型
function dddCreate_Cube(r1) {
	let dddCreate_Cube_Array = [];
	dddCreate_Cube_Array.push([r1, r1, r1])
	dddCreate_Cube_Array.push([r1, -r1, r1])
	dddCreate_Cube_Array.push([-r1, r1, r1])
	dddCreate_Cube_Array.push([-r1, -r1, r1])
	dddCreate_Cube_Array.push([r1, r1, -r1])
	dddCreate_Cube_Array.push([r1, -r1, -r1])
	dddCreate_Cube_Array.push([-r1, r1, -r1])
	dddCreate_Cube_Array.push([-r1, -r1, -r1])
	return dddCreate_Cube_Array;
}
function dddCreate_CubeSurface() {
	let dddCreate_CubeSurface_Array = [];
	dddCreate_CubeSurface_Array.push([0, 1, 3, 2])
	dddCreate_CubeSurface_Array.push([0, 2, 6, 4])
	dddCreate_CubeSurface_Array.push([0, 4, 5, 1])
	dddCreate_CubeSurface_Array.push([2, 3, 7, 6])
	dddCreate_CubeSurface_Array.push([1, 3, 7, 5])
	dddCreate_CubeSurface_Array.push([4, 5, 7, 6])
	return dddCreate_CubeSurface_Array;
}
function dddCreate_CubeNormal() {
	let dddCreate_CubeNormal_Array = [];
	dddCreate_CubeNormal_Array.push([0, 0, 1])
	dddCreate_CubeNormal_Array.push([0, 1, 0])
	dddCreate_CubeNormal_Array.push([1, 0, 0])
	dddCreate_CubeNormal_Array.push([-1, 0, 0])
	dddCreate_CubeNormal_Array.push([0, -1, 0])
	dddCreate_CubeNormal_Array.push([0, 0, -1])
	return dddCreate_CubeNormal_Array;
}
		//四面體模型
function dddCreate_Tetrahedron(r1) {
	let dddCreate_Cube_Array = [];
	dddCreate_Cube_Array.push([r1, r1, r1])
	dddCreate_Cube_Array.push([-r1, -r1, r1])
	dddCreate_Cube_Array.push([r1, -r1, -r1])
	dddCreate_Cube_Array.push([-r1, r1, -r1])
	return dddCreate_Cube_Array;
}
function dddCreate_TetrahedronSurface() {
	let dddCreate_CubeSurface_Array = [];
	dddCreate_CubeSurface_Array.push([0, 3, 1])
	dddCreate_CubeSurface_Array.push([0, 1, 2])
	dddCreate_CubeSurface_Array.push([0, 3, 2])
	dddCreate_CubeSurface_Array.push([1, 3, 2])
	return dddCreate_CubeSurface_Array;
}
function dddCreate_TetrahedronNormal() {
	let dddCreate_CubeNormal_Array = [];
	dddCreate_CubeNormal_Array.push([-1 / ((3) ** (1 / 2)), 1 / ((3) ** (1 / 2)), 1 / ((3) ** (1 / 2))])
	dddCreate_CubeNormal_Array.push([1 / ((3) ** (1 / 2)), -1 / ((3) ** (1 / 2)), 1 / ((3) ** (1 / 2))])
	dddCreate_CubeNormal_Array.push([1 / ((3) ** (1 / 2)), 1 / ((3) ** (1 / 2)), -1 / ((3) ** (1 / 2))])
	dddCreate_CubeNormal_Array.push([-1 / ((3) ** (1 / 2)), -1 / ((3) ** (1 / 2)), -1 / ((3) ** (1 / 2))])
	return dddCreate_CubeNormal_Array;
}
