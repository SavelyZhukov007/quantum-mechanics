import { ConfigProvider, theme } from 'antd'
import Chapter1 from './pages/Chapter1'

export default function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#7b8cff',
          colorBgContainer: '#0f0f1a',
          colorBgElevated: '#13131f',
          colorBorder: 'rgba(100,120,200,0.15)',
          fontFamily: 'Manrope, sans-serif',
          borderRadius: 12,
        },
      }}
    >
      <Chapter1 />
    </ConfigProvider>
  )
}