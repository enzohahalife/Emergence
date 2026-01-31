import { getAllNotionEntries } from '../lib/notion';
import { testNotionConnection } from '../lib/notion';
import { RSWEntry } from '../types';

export default async function TestPage() {
  let connectionTest: any = null;
  let entries: RSWEntry[] = [];
  let error: string | null = null;

  try {
    // 测试连接
    connectionTest = await testNotionConnection();

    // 获取数据
    entries = await getAllNotionEntries();
  } catch (err) {
    error = err instanceof Error ? err.message : 'Unknown error';
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>🔍 Notion API 测试页面</h1>

      <div style={{ marginBottom: '20px' }}>
        <h2>📊 连接测试结果</h2>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
          {JSON.stringify(connectionTest, null, 2)}
        </pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>📄 数据获取结果</h2>
        <p><strong>数据条数:</strong> {entries.length}</p>
        {error && (
          <div style={{ color: 'red', background: '#ffe6e6', padding: '10px', borderRadius: '5px' }}>
            <strong>错误:</strong> {error}
          </div>
        )}
      </div>

      <div>
        <h2>📋 数据预览</h2>
        {entries.length > 0 ? (
          <div>
            {entries.slice(0, 3).map((entry, index) => (
              <div key={entry.id} style={{
                border: '1px solid #ddd',
                margin: '10px 0',
                padding: '10px',
                borderRadius: '5px'
              }}>
                <h3>条目 {index + 1}</h3>
                <p><strong>ID:</strong> {entry.id}</p>
                <p><strong>标题:</strong> {entry.title || '无标题'}</p>
                <p><strong>URL:</strong> {entry.url || '无URL'}</p>
                <p><strong>作者:</strong> {entry.author_name || '无作者'}</p>
                <p><strong>发布日期:</strong> {entry.publication_date || '无日期'}</p>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: '#666', fontStyle: 'italic' }}>
            没有找到数据
          </div>
        )}
      </div>

      <div style={{ marginTop: '30px', padding: '15px', background: '#e6f3ff', borderRadius: '5px' }}>
        <h3>💡 调试提示</h3>
        <ul>
          <li>如果连接测试失败，检查环境变量设置</li>
          <li>如果数据为空，检查数据库权限和内容</li>
          <li>查看浏览器控制台和服务器日志获取更多信息</li>
          <li>运行 <code>node debug-notion.js</code> 进行详细调试</li>
        </ul>
      </div>
    </div>
  );
}