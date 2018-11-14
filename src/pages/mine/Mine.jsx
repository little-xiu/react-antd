import { Timeline } from 'antd';

import React, {Component} from 'react'
import Header from "../../components/header.jsx"

class Mine extends Component{
    render(){
        return (
            <div id="mine" className="page">
                <Header showBack>我的</Header>
                <div>
                <Timeline>
    <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
    <Timeline.Item>Solve initial network problems 2015-09-01</Timeline.Item>
    <Timeline.Item>Technical testing 2015-09-01</Timeline.Item>
    <Timeline.Item>Network problems being solved 2015-09-01</Timeline.Item>
  </Timeline>
                </div>
            </div>
        )
    }
}

export default Mine;



