const path = require('path');
const fse = require('fs-extra');
const klaw = require('klaw');
const csv = require('csvtojson');

module.exports = async () => {
	await new Promise(async resolve => {
		const assetPath = path.resolve(__dirname, "../data/csv/");
		const outputPath = path.resolve(__dirname, "../data/json");

		await fse.ensureDir(outputPath);

		await klaw(assetPath)
			.on("data", async item => {
				if (!/\.csv$/i.test(item.path)) return;

				const json = await csv().fromFile(item.path);
				await fse.writeJson(path.join(
					outputPath,
					path.basename(item.path).replace(/\.csv$/i, ".json")
				), json)
			})
			.on("end", resolve);
	})
}

module.exports();
