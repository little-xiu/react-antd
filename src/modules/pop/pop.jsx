import React from 'react';
import {Route, Switch} from 'react-router-dom';
import InterviewArrange from './interviewer/arrange/InterviewArrange';
const Pop = ({ match }) => {
  return (
    [
      <Switch key="1">
        <Route path={`${match.url}/interview-arrange`} component={InterviewArrange} key="interview-arrange" />
      </Switch>
    ]
  )
}
export default Pop;