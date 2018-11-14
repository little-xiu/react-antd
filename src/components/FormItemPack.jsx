import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Form, Icon, Input, Button, DatePicker, Checkbox, Radio, Upload, Select, InputNumber, Col, Cascader, Switch, Rate} from 'antd';
import classNames from 'classNames';
import ReactDom from 'react-dom';
import RadioButton from 'antd/lib/radio/radioButton';
import './FormItemPack.css';
const FormItem = Form.Item;
export const defaultFormItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 18},
}
class FormItemPack extends Component {
    static PropTypes = {
        form: PropTypes.object,// 如果type是 submit button,不需要传
        labelCol: PropTypes.object,//用法同antd的<Col>,默认{span:6}
        wrapperCol: PropTypes.object,//用法同antd的<Col>,默认{span:17}
        fullCol: PropTypes.bool,//是否沾满行，默认为false,布局为设置的labelCol和wrapperCol，true 为沾满行，
        type: PropTypes.oneOf([
            'text',
            'input',
            'number',
            'password',
            'textarea',
            'checkbox',
            'checkboxGroup',
            'radio',
            'date',
            'rangePicker',
            'monthPicker',
            'phone',
            'email',
            'upload',
            'select',
            'submit',
            'button',
            'reset',
            'cascader',//级联选择
            'switch',
            'search',
            'rate',
            'radioButton',
        ]),
        required: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),// 是否必填项，当是字符串，必填校验不通过则显示改字符串
        label: PropTypes.node,//表单显示的文本， 可以为标签
        errorLabel: PropTypes.string,//表单错误时的文本
        action: PropTypes.string,//使用upload时的上传地址
        maxLength: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),//文本框输入的最大值
        minLength: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        validateTrigger: PropTypes.array,//触发验证的时机
        name: PropTypes.string,//表单元素获取值或赋值的属性
        rules: PropTypes.array,//验证规则
        checkboxText: PropTypes.string,//复选框显示的文本
        options: PropTypes.any,//数据(value, label, disabled, children)用于radio, checkboxGroup, select, ‘children’用于cascader
        optionsKey: PropTypes.shape({
            value: PropTypes.string,
            label: PropTypes.string,
            disabled: PropTypes.string,
            children: PropTypes.string,
        }),// options的key转换
        defaultValue: PropTypes.any,
        buttonType: PropTypes.oneOf(['primary', 'dash', 'danger', 'default']),//按钮的样式
        formItemCls: PropTypes.string,//添加在<FormItem>的样式
        span: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),// 需为数字，占的栅格数
        inline: PropTypes.bool,//true:渲染为display: inline-block, false: block,默认为false
        hasColon: PropTypes.bool,//强制指定有无冒号
        formItemStyle: PropTypes.object,
        hideNumHandler: PropTypes.bool,//是否显示number类型右侧的加减按钮
        formatMoney: PropTypes.bool,//是否转化成金额显示，仅对number类型有效
        noValidate: PropTypes.bool,//true:不校验，默认false
        changePopContainer: PropTypes.bool,//antd默认会将下拉，日历，级联的弹出层绑定到body里，该参数可将弹出层绑定到<FormItem>里
        hidden: PropTypes.bool,//是否隐藏元素
    }
    static defaultProps = {
        type: 'input',
        labelCol: defaultFormItemLayout.labelCol,
        wrapperCol: defaultFormItemLayout.wrapperCol,
        fullCol: false,
        maxLength: null,
        minLength: null,
        action: 'http://.com',
        validateTrigger: ['onBlur', 'onChange'],
        checkboxText: '是',
        options: null,
        form: null,
        name: null,
        required: false,
        label: null,
        errorLabel: '',
        rules: [],
        defaultValue: null,
        buttonType: null,
        formItemCls: '',
        span: null,
        inline: false,
        hasColon: false,
        formItemStyle: null,
        hideNumHandler: false,
        noValidate: false,
        changePopContainer: false,
        hidden: false,
        formatMoney: false,
    }
    //获取验证规则
    getValidateRules = () => {
        const {required, type, rules, noValidate} = this.props;
        if (noValidate) {
            return rules;
        }
        const allRules = [];
        if (required) {
            const requireOpt = this.getRequireValidate();
            allRules.push(requireOpt);
        }
        if (type === 'email') {
            allRules.push({type: 'email', message: '请输入正确的邮箱地址'});
        }
        if (type === 'phone') {
            allRules.push({pattern: /^1\d{10}/, message: '请输入正确的手机号码'});
        }
        if (this.checkIsTypingType() && type !== 'number') {
            const minLength = this.props.minLength;
            if (minLength) {
                allRules.push({min: Number(minLength), message: `不能小于${minLength}个字`});
            }
            const maxLength = this.getMaxLength();
            allRules.push({max: maxLength, message: `不能超过${maxLength}个字`});
        }
        if (!rules || rules.length === 0) {
            return allRules;
        }
        return allRules.concat(rules);
    }
    getRequireValidate = () => {
        const {type, label, errorLabel, required} = this.props;
        let message = null;
        if (type === 'upload') {
            message = '附件不能为空';
        } else if (typeof required === 'string') {
            message = required;
        } else {
            const tipPrefix = this.checkIsTypingType() ? '请输入' : '请选择';
            let msgLabel = '';
            if (errorLabel) {
                msgLabel = errorLabel;
            } else if (label && (typeof label === 'string')) {
                msgLabel = label;
            }
            message = tipPrefix + msgLabel;
        }
        const requireOpt = {required: true, message};
        if (type !== 'number') {
            const validateType = this.getValidateType(type);
            Object.assign(requireOpt, {type: validateType, whitespace: true});
        }
        return requireOpt;
    }
    //验证的类型
    getValidateType = (type) => {
        let validateType = null;
        if (type === 'date' || type === 'monthPicker' || (this.props.labelInValue && !this.isMultiple())) {
            validateType = 'object';
        } else if (type === 'rangePicker' || type === 'cascader' || type === 'checkboxGroup' || (type === 'select' && this.isMultiple())) {
            validateType = 'array';
        } else if (type === 'rate') {
            validateType = 'number';
        } else {
            validateType = 'string';
        }
        return validateType;
    }
    isMultiple = () => {
        return this.props.multiple || this.props.mode === 'multiple' || this.props.mode === 'tags';
    }
    getRadioButton = (options, otherOption) => {
        const radioButton = Radio.Button;
        const raidoBtnArr = options && options.map((item) => {
            const {value, label} = this.formatOptionAttr(item);
            return <RadioButton key={value} value={value}>{label}</RadioButton>;
        });
        return (
            <Radio.Group {...otherOption}>
            {raidoBtnArr}
            </Radio.Group>
        );
    }
    getSelect = (options, otherOption) => {
        const Option = Select.Option;
        const optionArr = options && options.map((item) => {
            const {value, label} = this.formatOptionAttr(item);
            return <Option key={value} value={value} disabled={item.disabled}>{label}</Option>;
        });
        return <Select {...this.getPopupContainer()} {...otherOption}>{optionArr || []}</Select>;
    }
    getFormEleByType = (type, rest) => {
        if (this.isButton(type)) {
            const {onClick, ...buttonRest} = rest;
            return (
                <Button
                    type={this.props.buttonType || (type === 'submit' ? 'primary' : '')}
                    htmlType={type}
                    onClick={this.handleBtnClick}
                    {...buttonRest}
                >
                    {this.props.label || '提交'}
                </Button>
            );
        }
        if(type === 'input' || type === 'email' || type === 'phone' || type === 'password') {
            const itemType = (type === 'password') ? {type} : '';
            const typingMaxLength = this.getTypingMaxLength();
            return <Input {...itemType} {...rest} maxLength={typingMaxLength} />;
        }
        if (type === 'search') {
            const typingMaxLength = this.getTypingMaxLength();
            return (
                <Input.Search
                    maxLength={typingMaxLength}
                    {...rest}
                />
            );
        }
        if (type === 'date') {
            return <DatePicker {...this.getCalendarContainer()} {...rest} />;
        }
        if (type === 'monthPicker') {
            return <DatePicker.MonthPicker {...this.getCalendarContainer()} {...rest} />;
        }
        if (type === 'rangePicker') {
            return <DatePicker.RangePicker {...this.getCalendarContainer()} {...rest} />;
        }
        if (type === 'checkbox') {
            return <Checkbox {...rest}>{this.props.checkboxText}</Checkbox>;
        }
        if (type === 'checkboxGroup') {
            return <Checkbox.Group options={this.formatOption(this.props.options)} {...rest} />;
        }
        if (type === 'switch') {
            return <Switch {...rest} />;
        }
        if (type === 'number') {
            const maxLength = this.props.maxLength ? {maxLength: this.props.maxLength} : null;
            let formateMoneyOption = null;
            if (this.props.formatMoney) {
                formateMoneyOption = {
                    formatter: value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                    parser: value => value.replace(/\$\s?|(,*)/g, ''),
                };
            }
            return <InputNumber {...rest} {...maxLength} {...formateMoneyOption} />;
        }
        if (type === 'radio') {
            return <Radio.Group options={this.formatOption(this.props.options)} {...rest} />;
        }
        if (type === 'radioButton') {
            return this.getRadioButton(this.props.options, rest);
        }
        if (type === 'select') {
            return this.getSelect(this.props.options, rest);
        }
        if (type === 'cascader') {
            return <Cascader {...this.getPopupContainer()} options={this.formatOption(this.props.options)} {...rest} />;
        }
        if (type === 'rate') {
            return <Rate {...rest} />;
        }
        if (type === 'upload') {
            return (
                <Upload action={this.props.action} name={this.props.name} {...rest}>
                    <Button>
                        <Icon type="upload" />点击上传
                    </Button>
                </Upload>
            );
        }
    }
    getCalendarContainer = () => {
        return this.getPopContainer('getCalendarContainer');
    }
    getPopupContainer = () => {
        return this.getPopContainer('getPopupContainer');
    }
    // 日历的弹出层方法名是getCalenderContainer,其他弹出层的方法名是getPopupContainer
    getPopContainer = (methodName) => {
        return this.props.changePopContainer ? {[methodName]: () => ReactDom.findDOMNode(this.wrapperRef) } : null;
    }
    getFieldOption = () => {
        const validRules = this.getValidateRules();
        const {defaultValue, type} = this.props;
        let {validateTrigger} = this.props;
        if (type === 'cascader' || type === 'select') {
            //级联选择时， validateTrigger为onBlur会导致选中失效，故让其只在onChange时触发验证
            validateTrigger = ['onChange'];
        }
        if (type === 'number') {
            //为number类型且控件在Modal里时，指定validateTrigger会导致控件可输入字母，故去除validateTrigger
            validateTrigger = undefined;
        }
        //设置FieldDecorator
        const fieldOptioin = {
            rules: validRules,
            validateTrigger,
        };
        if (defaultValue !== undefined && defaultValue !== null && defaultValue !== '') {
            //antd 在2.13.10版本中，如果指定了initialValue属性，placeholder会失效，故做null值判断
            fieldOptioin.initialValue = defaultValue;
        }
        if (type === 'checkbox' || type === 'switch') {
            fieldOptioin.valuePropName = 'checked';
        } else if (type === 'upload') {
            fieldOptioin.valuePropName = 'fileList';
            fieldOptioin.getValueFromEvent = this.normFile;
        }
        return fieldOptioin;
    }
    //文本输入的最大长度，如果有校验，则需在最大长度基础上+1
    getTypingMaxLength = () => {
        const maxLength = this.getMaxLength();
        return `${this.props.noValidate ? maxLength : maxLength + 1}`;
    }
    //文本校验的最大的长度，textarea默认为4000,其他默认为300
    getMaxLength = () => {
        let {maxLength} = this.props;
        if (maxLength === null) {
            maxLength = (this.props.type === 'textarea') ? 4000 : 300;
        } else {
            maxLength = typeof maxLength === 'string' ? Number(maxLength) : maxLength;
        }
        return maxLength;
    }
    getFormEleDecorator = () => {
        const {
            form,
            type,
            name,
            required,//是否必填
            label,
            errorLabel,
            rules,
            options,
            optionsKey,
            defaultValue,
            validateTrigger,//触发验证的时机
            action,
            labelCol,
            wrapperCol,
            fullCol,
            maxLength,
            minLength,
            hideNumHandler,
            formatMoney,
            checkboxText,
            buttonType,
            formItemCls,
            span,
            inline,
            hasColon,
            formItemStyle,
            noValidate,
            changePopContainer,
            hidden,
            ...rest
        } = this.props;
        //表单元素
        const {children} = this.props;
        const formEle = children || this.getFormEleByType(type, {placeholder: this.getPlaceholder(), ...rest});
        if (this.isButton(type) || children) {
            //如果是button或者有子元素，则不需绑定 antd-form
            return formEle;
        }
        if (type === 'text') {
            return defaultValue;
        }
        if (!name) {
            console.error('没有子元素时，name不能为空，配置为：', this.props);
            return null;
        }
        if (!form) {
            console.error('form不能为空，对应的name为：', this.props.name);
            return null;
        }
        const fieldOption = this.getFieldOption();
        return form.getFieldDecorator(name, fieldOption)(formEle);
    }
    //是否显示冒号， 没有文本或文本为空字符串时，则不显示冒号
    getColon = (formItemLabel) => {
        if (!this.props.hasColon) {
            return false;
        }
        if (!formItemLabel || (typeof formItemLabel === 'string' && formItemLabel.trim() === '')) {
            return false;
        }
        return true;
    }
    getPlaceholder = () => {
        const {placeholder, type, disabled} = this.props;
        if (disabled) {
            return '';
        }
        if (placeholder) {
            return placeholder;
        }
        if (type === 'rangePicker') {
            return ['开始日期', '结束日期'];
        }
        return this.checkIsTypingType() ? '请输入' : '请选择';
    }
    //检查是否输入类型
    checkIsTypingType = () => {
        return ['input', 'number', 'password', 'textarea', 'phone', 'email', 'search'].includes(this.props.type);
    }
    //转换options的属性
    formatOptionAttr = (opt) => {
        if (typeof opt === 'string') {
            return {value: opt, label: opt};
        }
        const {optionsKey} = this.props;
        if (!optionsKey) {
            return opt;
        }
        let children = opt[optionsKey.children || 'children'];
        if (children) {
            //递归转换
            children = this.formatOption(children);
        }
        return {
            value: opt[optionsKey.value || 'value'],
            label: opt[optionsKey.label || 'label'],
            children,
            disabled: opt[optionsKey.disabled || 'disabled'],
        };
    }
    formatOption = (options) => {
        if (!Array.isArray(options)) {
            return [];
        }
        return options.map((opt) => {
            return this.formatOptionAttr(opt);
        });
    }
    normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }
    isButton = (type) => {
        return ['button', 'submit', 'reset'].indexOf(type) >= 0;
    }
    handleBtnClick = () => {
        if (this.props.type === 'reset') {
            //重置表单
            this.props.form.resetFields();
        }
        this.props.onClick && this.props.onClick();
    }
    render() {
        const {type, label, span, inline, fullCol, formItemStyle, children, required, hideNumHandler, hidden, formItemCls} = this.props;
        let {labelCol, wrapperCol} = this.props;
        //表单左边文本
        let formItemLabel = null;
        if (this.isButton(type)) {
            //有layout的时候，label为空格是为了让按钮位置在第二列
            formItemLabel = !inline && labelCol ? ' ' : '';
        } else if (children && required && label && type !== 'text') {
            formItemLabel = <span className='ant-form-item-required'>{label}></span>;
        } else {
            formItemLabel = label;
        }
        if (fullCol || inline) {
            labelCol = null;
            wrapperCol = null;
        }
        const getFormEleDecorator = this.getFormEleDecorator();
        const formItem = (
            <FormItem
                style={formItemStyle}
                ref={(ref) => {this.wrapperRef = ref;}}
                className={classNames(
                    formItemCls,
                    {'ant-input-number__no_handler': hideNumHandler},
                    {'form-item-pack--ele__inline': inline},
                    {'form-item-pack--ele__hide': hidden},
                )}
                labelCol={labelCol}
                wrapperCol={wrapperCol}
                label={formItemLabel}
                colon={this.getColon(formItemLabel)}
            >
                {getFormEleDecorator}
            </FormItem>
        );
        if (inline || span === null) {
            return formItem;
        }
        return (
            <Col span={span}>
                {formItem}
            </Col>
        );
    }
}
export default FormItemPack;
