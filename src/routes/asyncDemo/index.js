import React, { Component } from 'react'
import {connect} from 'dva'
import moment from 'moment'
import './index.less'
import 'antd/dist/antd.css'
import { Button, Col, Form, Input, message, Row, DatePicker, Select } from 'antd'
import QueueAnim from 'rc-queue-anim'

const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;

@Form.create()
class FormPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      submitted: false
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleReset = this.handleReset.bind(this)
  }

  handleSubmit (e) {
    e.preventDefault()
    this.setState({loading: true})
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) { console.log(err) }
      else {
        const body = {
          ...values,
          flag: this.props.app.formData.flag,
          check_in: values.check_in? moment(values.check_in).format('YYYY-MM-DD'): '',
          check_out: values.check_out? moment(values.check_out).format('YYYY-MM-DD'): '',
          apartment_type: values.apartment,
      }
        // 处理发送的数据
        const id = this.props.app.formData.id
        fetch(`http://form.andyhui.xin/nteam/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        }).then((res) => {
          return res.json()
        }).then((json) => {
          // 也可以直接对返回的res数据操作,看后端给的啥数据格式
          console.log(json)
          if (json.code === 1000){
            message.success('提交成功')
            this.setState({submitted: true})
          }
        }).catch((e) => {
          console.log(e.message)
        })
      }
    })
    setTimeout(() => {
      this.setState({loading: false})
    }, 1000)
  }

  handleReset (e) {
    e.preventDefault()
    this.setState({loading: false})
    this.props.form.resetFields()
  }
  PrefixInteger(num, n) {
    return (Array(n).join(0) + num).slice(-n);
  }

  render () {
    const {getFieldDecorator} = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 6}
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 12}
      }
    }
    const middleFlag = this.PrefixInteger(this.props.app.formData.id, 3)

    return (
      <QueueAnim
        component='Form'
        type='top'
        className='main-content'
        delay={300}
        duration={600}
      >
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <FormItem
            label='个人id'
            {...formItemLayout}
            key='form-content-name'
          >
            {getFieldDecorator('id', {
              initialValue: `${middleFlag}${(this.props.app.formData.flag || '').slice(3,4)}`
            })(
              <Input className='form-content-input' disabled='true' />
            )}
          </FormItem>
          <FormItem
            label='姓名'
            {...formItemLayout}
            key='form-content-name'
          >
            {getFieldDecorator('name', {
              initialValue: this.props.app.formData.name
            })(
              <Input className='form-content-input' disabled='true' />
            )}
          </FormItem>
          <FormItem
            label='手机号'
            {...formItemLayout}
            key="form-content-mobile"
            hasFeedback
          >
            {getFieldDecorator('mobile',{
              rules: [{
                required: true, message: '请输入身份证号',
                pattern: /^((13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])+\d{8})$/,
              }],
                initialValue: this.props.app.formData.mobile
              }
            )(
              <Input className='form-content-input'  />,
            )}
          </FormItem>
          <FormItem
            label='邮箱'
            {...formItemLayout}
            key="form-content-email"
          >
            {getFieldDecorator('email',{
              initialValue: this.props.app.formData.email
              })(
              <Input className='form-content-input' disabled='true' />,
            )}
          </FormItem>
          <FormItem
            label='T恤尺码'
            {...formItemLayout}
            key="form-content-Tshirts"
          >
            {getFieldDecorator('shirt',{
              initialValue: this.props.app.formData.shirt
            })(
              <Input className='form-content-input' disabled='true' />,
            )}
          </FormItem>
          <FormItem
            label='所属队伍'
            {...formItemLayout}
            key="form-content-teams"

          >
            {getFieldDecorator('team_name',{
                initialValue: this.props.app.formData.team_name
              }
            )(
              <Input className='form-content-input' disabled='true' />,
            )}
          </FormItem>
          <FormItem
            label='所在学校'
            {...formItemLayout}
            key="form-content-school"
          >
            {getFieldDecorator('school',{
                initialValue: this.props.app.formData.school
              }
            )(
              <Input className='form-content-input' disabled='true' />,
            )}
          </FormItem>
          <FormItem
            label='曾获奖项'
            {...formItemLayout}
            key="form-content-reward"
          >
            {getFieldDecorator('prize',{
                initialValue: this.props.app.formData.prize
              }
            )(
              <Input className='form-content-input' disabled='true' />,
            )}
          </FormItem>
          <FormItem
            label='身份证号'
            {...formItemLayout}
            key="form-content-identify"
            extra="用于办理保险"
          >
            {getFieldDecorator('id_card', {
                rules: [{
                  required: true, message: '请输入身份证号',
                  pattern: /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/,
                }],
                initialValue: this.props.app.formData.id_card
              }
            )(
              <Input className='form-content-input' />,
            )}
          </FormItem>
          <FormItem
            label='户籍地址'
            {...formItemLayout}
            key="form-content-address"
            hasFeedback
            extra="精确到村（培训基地档案上报需要）"
          >
            {getFieldDecorator('native_place', {
              rules: [{
                required: true, message: '请输入户籍'
              }],
              initialValue: this.props.app.formData.native_place
            })(
              <TextArea rows={4} />
            )}
          </FormItem>
          <FormItem
            label='宾馆入住日期'
            {...formItemLayout}
            key="form-content-livedate"
            hasFeedback
          >
            {getFieldDecorator('check_in',{
              initialValue: this.props.app.formData.check_in ? moment(this.props.app.formData.check_in) : '',
              }
            )(
              <DatePicker placeholder='请选择入住日期' style={{width: '300px'}} />
            )}
          </FormItem>
          <FormItem
            label='宾馆离开日期'
            {...formItemLayout}
            key="form-content-leafdate"
            hasFeedback
          >
            {getFieldDecorator('check_out',{
              rules: [{
                required: true, message: '请输入宾馆离开日期'
              }],
              initialValue: this.props.app.formData.check_out ? moment(this.props.app.formData.check_out): '',
              }
            )(
              <DatePicker placeholder='请选择离开日期' style={{width: '300px'}} />

            )}
          </FormItem>
          <FormItem
            label='特殊要求备注'
            {...formItemLayout}
            key="form-content-more"
            hasFeedback
          >
            {getFieldDecorator('remark', {
              initialValue: this.props.app.formData.remark
            })(
              <TextArea rows={4} />
            )}
          </FormItem>
          <FormItem
            key="form-content-footer"
            onSubmit={this.handleSubmit}
          >
            <Row gutter={16} type='flex'>
              <Col className='left-content' xs={{span: 24}} sm={{span: 12, offset: 6}}>
                <Button
                  type='primary'
                  htmlType='submit'
                  className='form-button'
                  loading={this.state.loading}
                  disabled={this.state.submitted}
                >
                  {this.state.submitted ? '提交成功' : '点击提交'}
                </Button>
                <Button
                  type="ghost"
                  onClick={this.handleReset}
                  className='form-button'
                  style={{marginLeft: 18}}
                >
                  重置
                </Button>
              </Col>
            </Row>
          </FormItem>
        </Form>
      </QueueAnim>
    )
  }
}

export default connect(({app}) => ({app}))(FormPage)
