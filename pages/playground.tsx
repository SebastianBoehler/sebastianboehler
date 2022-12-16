import { DownOutlined } from '@ant-design/icons';
import { Button, MenuProps } from 'antd';
import { Dropdown, Space, Typography, Input } from 'antd';
const { TextArea } = Input;
import { useState } from 'react';

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


export default function Playground({ models }: any) {
  const [model, setModel] = useState('davinci')
  const [textType, setTextType] = useState('')
  const [text, setText] = useState('')
  const [apiKey, setApiKey] = useState('')

  const items: MenuProps['items'] = models.map(
    (model: any) => {
      return {
        key: model.id,
        label: model.id,
      }
    }
  )

  return (
    <div>
      <Space size={'large'} >
        <Dropdown
          menu={{
            items,
            selectable: true,
            defaultSelectedKeys: ['davinci'],
            onSelect: ({ key }) => { setModel(key) },
          }}
          trigger={['click']}
        >
          <Typography.Link>
            <Space>
              {model || 'Select Model'}
              <DownOutlined />
            </Space>
          </Typography.Link>
        </Dropdown>
        <Dropdown
          menu={{
            items: types,
            selectable: true,
            //defaultSelectedKeys: ['Article'],
            onSelect: ({ key }) => {
              setTextType(key)
              fetch('http://localhost:3000/api/openai/prompt', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ textType: key })
              })
                .then(res => res.text())
                .then(raw => {
                  //TODO: remove old prompt
                  setText(raw + '\n' + text)
                })
            },
          }}
          trigger={['click']}
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
      />
      <br />
      <br />
      <Button
        type="primary"
        onClick={() => {
          console.log(model, textType, text)
        }}
      >Write</Button>
    </div >
  )
}

export async function getServerSideProps() {
  const models = await fetch('https://sebastian-boehler.com/api/openai/models')
  const modelsJson = await models.json()

  return {
    props: {
      models: modelsJson
    }
  }
}

