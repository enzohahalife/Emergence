import { testNotionConnection } from '../lib/notion';

export default async function NotionTestPage() {
  const testResult = await testNotionConnection();

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>🔍 Notion 数据库连接测试</h1>

      <div style={{ marginBottom: '20px' }}>
        <h2>连接状态</h2>
        <div style={{
          padding: '10px',
          backgroundColor: testResult.success ? '#d4edda' : '#f8d7da',
          border: `1px solid ${testResult.success ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '4px',
          color: testResult.success ? '#155724' : '#721c24'
        }}>
          {testResult.success ? '✅ 连接成功' : '❌ 连接失败'}
        </div>
      </div>

      {testResult.error && (
        <div style={{ marginBottom: '20px' }}>
          <h2>错误信息</h2>
          <pre style={{
            backgroundColor: '#f8f9fa',
            padding: '10px',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            overflow: 'auto'
          }}>
            {testResult.error}
          </pre>
        </div>
      )}

      {testResult.databaseInfo && (
        <div style={{ marginBottom: '20px' }}>
          <h2>数据库信息</h2>
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '10px',
            border: '1px solid #dee2e6',
            borderRadius: '4px'
          }}>
            <p><strong>标题:</strong> {testResult.databaseInfo.title?.[0]?.plain_text || 'N/A'}</p>
            <p><strong>ID:</strong> {testResult.databaseInfo.id}</p>
            <p><strong>创建时间:</strong> {testResult.databaseInfo.created_time}</p>
            <p><strong>最后编辑:</strong> {testResult.databaseInfo.last_edited_time}</p>
          </div>
        </div>
      )}

      {testResult.properties && Object.keys(testResult.properties).length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2>数据库字段结构</h2>
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '10px',
            border: '1px solid #dee2e6',
            borderRadius: '4px'
          }}>
            {Object.entries(testResult.properties).map(([name, property]: [string, any]) => (
              <div key={name} style={{ marginBottom: '8px' }}>
                <strong>{name}:</strong> {property.type}
                {property.type === 'select' && property.select && (
                  <span style={{ color: '#6c757d' }}>
                    {' '}(选项: {property.select.options?.map((opt: any) => opt.name).join(', ') || 'N/A'})
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {testResult.sampleData && testResult.sampleData.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2>示例数据 (前3条)</h2>
          {testResult.sampleData.slice(0, 3).map((page: any, index: number) => (
            <div key={index} style={{
              backgroundColor: '#f8f9fa',
              padding: '10px',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              marginBottom: '10px'
            }}>
              <h3>条目 {index + 1}</h3>
              {Object.entries(page.properties || {}).map(([name, property]: [string, any]) => {
                let value = 'N/A';
                try {
                  switch (property.type) {
                    case 'title':
                      value = property.title?.map((t: any) => t.plain_text).join('') || 'N/A';
                      break;
                    case 'rich_text':
                      value = property.rich_text?.map((t: any) => t.plain_text).join('') || 'N/A';
                      break;
                    case 'url':
                      value = property.url || 'N/A';
                      break;
                    case 'date':
                      value = property.date?.start || 'N/A';
                      break;
                    case 'number':
                      value = property.number?.toString() || 'N/A';
                      break;
                    case 'select':
                      value = property.select?.name || 'N/A';
                      break;
                    case 'multi_select':
                      value = property.multi_select?.map((s: any) => s.name).join(', ') || 'N/A';
                      break;
                    case 'files':
                      value = property.files?.length > 0 ? `${property.files.length} 个文件` : 'N/A';
                      break;
                    case 'checkbox':
                      value = property.checkbox ? '是' : '否';
                      break;
                    default:
                      value = `[${property.type}]`;
                  }
                } catch (err: any) {
                  value = `错误: ${err.message}`;
                }

                return (
                  <div key={name} style={{ marginBottom: '4px' }}>
                    <strong>{name}:</strong> {value}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#e9ecef', borderRadius: '4px' }}>
        <h3>🎯 下一步操作</h3>
        {testResult.success ? (
          <ul>
            <li>✅ Notion 连接正常</li>
            <li>📋 已分析数据库结构</li>
            <li>🔧 可以根据实际字段调整映射配置</li>
            <li>🚀 准备集成到主应用</li>
          </ul>
        ) : (
          <ul>
            <li>🔑 检查 API Token 是否正确</li>
            <li>🆔 验证 Database ID 是否正确</li>
            <li>🔐 确认集成已添加到数据库</li>
            <li>📝 检查数据库权限设置</li>
          </ul>
        )}
      </div>
    </div>
  );
}