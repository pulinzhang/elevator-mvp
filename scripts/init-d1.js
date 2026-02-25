/**
 * D1 数据库初始化脚本
 * 用于在 Cloudflare D1 上创建表和初始数据
 * 
 * 使用方法:
 *   npx wrangler d1 execute elevator-db --local --file=scripts/init-d1.js
 *   npx wrangler d1 execute elevator-db --remote --file=scripts/init-d1.js
 */

const schemaPath = require('path').join(__dirname, '..', 'schema.sql');
const fs = require('fs');

// 读取 schema 文件
const schema = fs.readFileSync(schemaPath, 'utf8');

module.exports = {
  async run(db) {
    // 执行 schema
    await db.exec(schema);
    console.log('✅ Schema 创建完成');

    // 插入示例数据
    const insertElevators = await db.prepare(
      "INSERT INTO elevators (brand, model, base_price) VALUES (?, ?, ?)"
    );

    const brands = [
      ['Otis', 'Gen2', 25000],
      ['ThyssenKrupp', 'TAC32', 22000],
      ['Schindler', '3300', 20000],
      ['KONE', 'MonoSpace', 23000],
      ['Mitsubishi', 'ELENESSA', 21000]
    ];

    for (const [brand, model, price] of brands) {
      await insertElevators.bind(brand, model, price).run();
    }

    console.log('✅ 示例数据插入完成');
    console.log('🎉 D1 数据库初始化完成!');
  }
};

