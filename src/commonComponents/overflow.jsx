import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
// 文本过长出现省略号
class OverflowText extends PureComponent {
    static PropTypes = {
        // 显示的内容
        text: PropTypes.node,
        // 显示的宽度
        width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        // true:减去宽度14（因为表格列有padding，故表格中为true）
        minus: PropTypes.bool,
        style: PropTypes.object,
        className: PropTypes.string,
    }
    static defaultProps = {
        text: null,
        minus: true,
        style: null,
        className: '',
    }
    render() {
        const { text, width, minus, children, style, className, ...restProps } = this.props;
        if ((text === null || text === '') && (children === undefined || children === null || children === '')) {
            return '';
        }
        // 当width为百分比时，也不会减宽度
        const minusWidth = minus && (typeof width === 'number' || width.indexOf('%') === -1) ? 20 : 0;
        return (
            <span
                title={text}
                className={`overflowStyle ${className}`}
                style={{ display: 'inline-block', maxWidth: width - minusWidth, verticalAlign: 'top', ...style }}
                {...restProps}
            >
                {children === 0 ? '0' : (children || text)}
            </span>
        )
    }
}
export default OverflowText;

// .overflowStyle {
//     text-overflow: ellipsis;
//      overflow: hidden;
//      white-space: nowrap;//不换行
//      word-break: keep-all;// 中英文都不换行
// }

//外部使用组件
// import OverflowText from '';
// const renderOverText = (text, width) => {
//     return <OverflowText width={width} text={text} minus />
// }
// // Table组件里使用
// getColums = () => {
//     return [
//         {
//             key: 'name',
//             dataIndex: 'name',
//             title: '候选人',
//             width: 70,
//             render: text => renderOverText(text, 137),
//         },
//     ]
// }
