import { DownOutlined } from '@ant-design/icons';
import { Button, Select } from 'antd';
import { Dropdown, Space, Typography, Input } from 'antd';
const { TextArea } = Input;
import { useEffect, useState } from 'react';
import OpenAI from '../hooks/openai'

const types = [
  {
    key: 'Article',
    label: 'Article',
  },
  {
    key: 'Twitter Post',
    label: 'Twitter Post'
  }
]

const tones = [
  { key: 'funny', label: 'funny' },
  { key: 'serious', label: 'serious' },
  { key: 'informative', label: 'informative' },
  { key: 'persuasive', label: 'persuasive' },
  { key: 'unbiased', label: 'unbiased' },
  { key: 'emotional', label: 'emotional' },
  { key: '5 year old', label: '5 year old' },
]

export default function Playground({ models }: any) {
  const [model, setModel] = useState('text-davinci-002')
  const [textType, setTextType] = useState('')
  const [text, setText] = useState('')
  const [prevText, setPrevText] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [myOpenAI, setMyOpenAI] = useState(new OpenAI(apiKey, model))
  const [tone, setTone] = useState(tones[1])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setMyOpenAI(new OpenAI(apiKey, model));
  }, [apiKey, model])

  const items: { value: string; label: string }[] = models.map(
    (model: Record<string, any>) => {
      return {
        value: model.id,
        label: model.id,
      }
    }
  )

  return (
    <div style={{ maxWidth: '1000px', margin: 'auto' }}>
      <Space size={'large'} >
        <Select
          defaultValue='text-davinci-003'
          onChange={setModel}
          options={items}
          disabled
        />
        <Dropdown
          menu={{
            items: types,
            selectable: true,
            //defaultSelectedKeys: ['Article'],
            onSelect: async ({ key }) => {
              setTextType(key)
              //TODO: get prompt and append to text
            },
          }}
          trigger={['click']}
          disabled
        >
          <Typography.Link>
            <Space>
              {textType || 'Select Text Type'}
              <DownOutlined />
            </Space>
          </Typography.Link>
        </Dropdown>
      </Space>
      <br />
      <br />
      <Input
        placeholder='OPENAI_API_KEY'
        value={apiKey}
        type='password'
        onChange={(e) => { setApiKey(e.target.value) }}
      ></Input>
      <br />
      <br />
      <TextArea
        rows={4}
        autoSize
        value={text}
        onChange={(e) => { setText(e.target.value) }}
        style={{ minHeight: '250px' }}
      />
      <br />
      <br />
      <Space>
        <Button
          type="primary"
          onClick={async () => {
            setLoading(true)

            const resp = await myOpenAI.runPrompt(text)
            setPrevText(text)
            setText(text + resp)

            setLoading(false)
          }}
          loading={loading}
        >Write</Button>
        <Button
          onClick={async () => {
            setText(prevText)
            setLoading(true)
            const resp = await myOpenAI.runPrompt(text)
            setPrevText(text)
            setText(text + resp)

            setLoading(false)
          }}
          loading={loading}
        >Retry</Button>
        <Dropdown.Button
          menu={{
            items: tones,
            onClick: ({ key }) => {
              console.log(key)
              const tone = tones.find(item => item.key === key)
              if (tone) setTone(tone)
            }
          }}
          loading={loading}
          onClick={async () => {
            setLoading(true)
            setPrevText(text)
            const resp = await myOpenAI.fixTone(text, tone.key)
            if (resp) setText(resp)

            setLoading(false)
          }}
        >Change tone</Dropdown.Button>
      </Space>
    </div >
  )
}

export async function getServerSideProps() {
  const models = [{
    id: 'text-davinci-003',
  }]

  return {
    props: {
      models
    }
  }
}

