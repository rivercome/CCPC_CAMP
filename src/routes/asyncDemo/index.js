import React, { Component } from 'react'
import {connect} from 'dva'
import moment from 'moment'
import './index.less'
import 'antd/dist/antd.css'
import {Button, Col, Form, Input, message, Row, DatePicker, Select, Radio, Cascader, TimePicker} from 'antd'
// import optionsss from '../../utils/Options'
import QueueAnim from 'rc-queue-anim'

const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

@Form.create()
class FormPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      submitted: false,
      options: [],
      // options: [{
      //   value: '',
      //   label: '',
      //   children: [{
      //     value: '',
      //     label: '',
      //     children: [
      //       {
      //         value: '',
      //         label: ''
      //       }
      //     ]
      //   }]
      // }]
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
        console.log('values.hotel_name', values.hotel_name)
        console.log('values.leavehour', moment(values.leavehour).format('HH:mm'))
        console.log('values.leavehour', moment(values.arrivehour).format('HH:mm'))
        const body = {
          ...values,
          flag: this.props.app.formData.flag,
          check_in: values.check_in ? moment(values.check_in).format('YYYY-MM-DD') : '',
          check_out: values.check_out ? moment(values.check_out).format('YYYY-MM-DD') : '',
          arrive: values.arrive ? moment(values.arrive).format('YYYY-MM-DD') + ' ' + moment(values.arrivehour).format('HH:mm') : '',
          leave: values.leave ? moment(values.leave).format('YYYY-MM-DD') + ' ' + moment(values.leavehour).format('HH:mm') : '',
          hotel_type: values.hotel_name ? values.hotel_name[1] : '',
          hotel_room_num: values.hotel_name ? values.hotel_name[2] : '',
          hotel_name: values.hotel_name ? values.hotel_name[0] : ''
      }
        // 处理发送的数据
        const id = this.props.app.formData.id
        fetch(`http://form.andyhui.top/nteam/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        }).then((res) => {
          return res.json()
        }).then((json) => {
          console.log('jaon',json)
          if (json.code === 1000){
            message.success('提交成功')
            this.setState({submitted: true})
            // this.props.history.push('/success')
          }
          else {
            message.error(json.message)
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
  componentDidMount() {
    fetch(`http://form.andyhui.top/hotel`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      return res.json()
    }).then(json => {
      // console.log('json', json)
      /**
       * 下面是一段特别窒息的数据处理的代码
       * /
       **/
      let options = []   // 需要的Cascader options选项
      const type = []
      const type2 = []
      for (let k in json.hotels) {   // k 获取到第一层的key值，即宾馆名称
        options.push({value: k, label: k, children: []})  // 添加第一层宾馆名称
        let flag = []
        let flag2 = []
        for (let l in json.hotels[k]) {  // l 第二层的key值， 即房间类型
          flag.push(l)                   // flag 保存房间类型
          flag2.push(json.hotels[k][l])  // flag2 保存房间具体信息
          // console.log('1', json.hotels[k])
          // console.log('2', json.hotels[k][l])
        }
        type.push(flag)                  // type 获取单次循环的结果，即顺序渲染
        type2.push(flag2)                // type2 获取单次循环  的结果，即顺序渲染
      }
      // let hotelType = []
      // // console.log('length', type.length)
      // for (let i = 0; i < type.length; i++) {
      //   hotelType[i] = type[i]
      // }
      // let hotelType2 = []
      // // console.log('length', type.length)
      // for (let i = 0; i < type2.length; i++) {
      //   hotelType2[i] = type2[i]
      // }
      // console.log(' hotelType2[i]', hotelType2)
      const len = options.length  // 保存一下option的长度，传说可以优化循环，其实的确可以优化循环，但是数组长度太小，基本感受不到。
      for (let i = 0; i < len; i++) {
      //   console.log('hotelType', i, hotelType[i])
        const value = type[i].map(item => {     // value保存一下，每个房间类型
          return item
        })
        const value2 = type2[i].map(item => {    //  保存的是房间号
          // console.log('item', item)
          const value3 = item.map(res => {       // 循环单个房间类型下的房间号， 中间变量
            // console.log('res', res)
            return res.hotel_room_num
          })
          return value3
        })
        const value3 = type2[i].map(item => {    // 原理同上，保存的是已经入住的人数
          // console.log('item', item)
          const value4 = item.map(res => {
            // console.log('res', res)
            return res.add_on
          })
          return value4
        })
        const peopleNum = []
        for (let j = 0; j < value.length; j++) {
          // console.log('hotel', value2[j])
          const num = value2[j].map(item => {
            // console.log('item', item)
            return item
          })
          value3[j].map(item => {
            peopleNum.push(item)
          })
          // console.log('room', num)
          // options[i].children.push({label: value[j], value: value[j], children: [{label: `${num}, 已有${value3[j]}人入住`, value: ''}]})
          options[i].children.push({label: value[j], value: value[j], children: []})
          for (let k = 0; k < num.length; k++) {
            // console.log('k', k)
            // options[i].children[j].push({label: `${num[k]}, 已有${value3[k]}人入住`, value: ''})
            options[i].children[j].children.push({label: `${num[k]}, 已有${peopleNum[k]}人入住`, value: num[k]})
            // console.log('aaa', options[i].children[j].children.push({label: `${num[k]}`, value: ''}))
          }
        }
      }
      this.setState({options})
    })
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
            key='form-content-id'
          >
            {getFieldDecorator('id', {
              initialValue: `${middleFlag}${(this.props.app.formData.flag || '').slice(3, 4)}`
            })(
              <Input className='form-content-input' disabled />
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
              <Input className='form-content-input' disabled />
            )}
          </FormItem>
          {/*  <FormItem
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
          </FormItem> */}
          <FormItem
            label='所在学校'
            {...formItemLayout}
            key="form-content-school"
          >
            {getFieldDecorator('school',{
              initialValue: this.props.app.formData.school
            }
            )(
              <Input className='form-content-input' disabled />
            )}
          </FormItem>
          {/* <FormItem
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
          </FormItem> */}
          <FormItem
            label='身份证号'
            {...formItemLayout}
            key="form-content-identify"
            extra='用于办理保险'
          >
            {getFieldDecorator('id_card', {
              rules: [{
                required: true, message: '请输入身份证号',
                pattern: /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/,
              }],
              initialValue: this.props.app.formData.id_card ? this.props.app.formData.id_card.replace(/(\s*$)/g, '') : ''
            }
            )(
              <Input className='form-content-input' />
            )}
          </FormItem>
          <FormItem
            label='户籍地址'
            {...formItemLayout}
            key="form-content-address"
            hasFeedback
            extra="精确到村"
          >
            {getFieldDecorator('native_place', {
              rules: [{
                required: true, message: '请输入户籍'
              }],
              initialValue: this.props.app.formData.native_place
            })(
              <Input className='form-content-input' />
            )}
          </FormItem>
          <FormItem
            label='行程抵达时间'
            {...formItemLayout}
            key="form-content-arrive"
            hasFeedback
          >
            {getFieldDecorator('arrive', {
              rules: [{
                required: true, message: '请输入抵达日期'
              }],
              initialValue: this.props.app.formData.arrive ? moment(this.props.app.formData.arrive.slice(0, 10)) : ''
            }
            )(
              <DatePicker placeholder='请选择抵达日期' style={{width: '300px'}} />,
            )}
          </FormItem>
          <FormItem
            label='抵达具体时间'
            {...formItemLayout}
            key="form-content-arrivehour"
            hasFeedback
          >
            {getFieldDecorator('arrivehour', {
              rules: [{
                required: true, message: '请选择抵达时间'
              }],
              initialValue: this.props.app.formData.arrive ? moment(this.props.app.formData.arrive.slice(11, 16), 'HH:mm') : ''
            }
            )(
              <TimePicker placeholder="请选择小时分钟" format='HH:mm' style={{width: '300px'}} />
            )}
          </FormItem>
          <FormItem
            label='行程离开日期'
            {...formItemLayout}
            key="form-content-leave"
            hasFeedback
          >
            {getFieldDecorator('leave', {
              rules: [{
                required: true, message: '请选择离开时间'
              }],
              initialValue: this.props.app.formData.leave ? moment(this.props.app.formData.leave.slice(0, 10)) : ''
            }
            )(
              <DatePicker placeholder='请选择抵达日期' style={{width: '300px'}} />,
              <TimePicker format="HH:mm" />
            )}
          </FormItem>
          <FormItem
            label='离开具体时间'
            {...formItemLayout}
            key="form-content-leavehour"
            hasFeedback
          >
            {getFieldDecorator('leavehour', {
              rules: [{
                required: true, message: '请选择离开时间'
              }],
              initialValue: this.props.app.formData.leave ? moment(this.props.app.formData.leave.slice(11, 16), 'HH:mm') : ''
            }
            )(
              <TimePicker placeholder="请选择小时分钟" format='HH:mm' style={{width: '300px'}} />
            )}
          </FormItem>
          <FormItem
            label='宾馆入住日期'
            {...formItemLayout}
            key="form-content-livedate"
            hasFeedback
          >
            {getFieldDecorator('check_in', {
              rules: [{
                required: true, message: '请选择入住时间'
              }],
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
            label='选择宾馆'
            {...formItemLayout}
            key='form-content-hotel_name'
            hasFeedback
          >
            {getFieldDecorator('hotel_name', {
              rules: [{
                required: true, message: '请选择宾馆'
              }],
              initialValue: [this.props.app.formData.hotel_name || '', this.props.app.formData.hotel_type || '', this.props.app.formData.hotel_room_num || '']
            })(
              <Cascader
                options={this.state.options}
                style={{width: '400px'}}
              />
            )}
          </FormItem>
          <FormItem
            label='接受房间调剂'
            {...formItemLayout}
            key="form-content-roomadjust"
          >
            {getFieldDecorator('adjust', {
              rules: [{
                required: true, message: '请选择是否接受房间调剂'
              }],
              initialValue: this.props.app.formData.adjust
            })(
              <RadioGroup>
                <Radio value={'是'}>是</Radio>
                <Radio value={'否'}>否</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem
            label='在食堂就餐'
            {...formItemLayout}
            key="form-content-restaurant"
          >
            {getFieldDecorator('eat_canteen', {
              rules: [{
                required: true, message: '请选择是否在食堂就餐'
              }],
              initialValue: this.props.app.formData.eat_canteen
            })(
              <RadioGroup>
                <Radio value={'是'}>是</Radio>
                <Radio value={'否'}>否</Radio>
              </RadioGroup>
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
