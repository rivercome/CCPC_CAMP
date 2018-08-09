import React, { Component} from 'react'
import { connect } from 'dva'
import { Form, Icon, Input, Button,message } from 'antd';
import 'antd/dist/antd.css'
import './index.less'
import axios from 'axios'

const FormItem = Form.Item;
@Form.create()
class HomePage extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        axios('http://form.andyhui.xin/check',{
          method: 'POST',
          data:{
            mobile: values.password,
            name: values.userName,
          },
        }).then(
          res =>{
            console.log(res)
            if (res.data.code === 1000){
              console.log(res.data)
              this.props.dispatch({
                type: 'app/formData',
                payload: res.data.info,
              })
              console.log('propssss',this.props)
              this.props.history.push('/form')
            }
            else if (res.data.code === 1001) {
              message.error('未填写手机号或姓名')
            }
            else if (res.data.code === 1002) {
              message.error('未通过筛选')
            }
            else if (res.data.code === 1003) {
              message.error('手机号或姓名错误')
            }
          }

        )
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: '请输入你的姓名' }],
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请输入你的姓名" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入你的手机号' }],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}  placeholder="请输入你的手机号" />
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" className="login-form-button">
            登录
          </Button>
        </FormItem>
      </Form>
    );
  }
}


export default connect(({app}) => ({app}))(HomePage)
