import React from 'react'
import { Jumbotron, Button, Grid, Row, Col } from 'react-bootstrap'

import ListContainer from './listcontainer'
import ActionDescription from './action-description'
import Description from './description'
import DescriptionNot from './description-not'
import StateInspector from './state-inspector'
import items from '../items'

const Page = () => (
  <div id="page">
    <Grid>
      <Row className="show-grid">
        <Col xs={12} md={12} className="col-center">
          <Jumbotron>
            <h1>yourchoice</h1>
            <p>Pure calculation of selection state, no UI involved.</p>
            <p><Button href="https://github.com/actano/yourchoice" target="_blank" bsStyle="info">Show on GitHub</Button></p>
          </Jumbotron>
          <Row>
            <Col xs={12} md={6}>
              <Description />
            </Col>
            <Col xs={12} md={6}>
              <DescriptionNot />
            </Col>
          </Row>
          <hr />
          <Row>
            <Col xs={12} md={6}>
              <ListContainer items={items} />
            </Col>
            <Col xs={12} md={6}>
              <ActionDescription />
              <StateInspector />
            </Col>
          </Row>
        </Col>
      </Row>
    </Grid>
  </div>
)

export default Page
