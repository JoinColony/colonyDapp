/* @flow */
import React, { Component } from 'react';
import Data from '../../data';
import { PinnerNoop } from '../../data/pinner';
import { Link } from 'react-router-dom';

const LOADING = 'loading';
const READY = 'ready';

class MyProfileRaw extends Component {
  constructor(props) {
    super(props);
    this.state = { status: LOADING };
  }

  onUpdate(profileContent) {
    console.log("onUpdate profileContent=", profileContent);
    this.setState({ status: READY, ...profileContent });
  }

  doUpdate({ name }) {
    if (name) {
      this.state.profile.setName(name);
    }
  }

  componentWillMount() {
    this.props.data.getMyUserProfile()
      .then(profile => {
        const addr = profile.address().toString();
        // TODO(laurent): broken
        const routeAddr = addr.match(/^\/orbitdb\/(.*)\/user-profile$/)[1];

        this.setState({ profile, routeAddr });
        profile.subscribe(x => this.onUpdate(x))
      })
  }

  render() {
    const { status } = this.state;

    if (status === LOADING) {
      return (
        <div>
          MyProfile: Loading...
        </div>
      )
    }
    else {
      const { isEmpty, name, created, routeAddr } = this.state;

      return (
        <div>
          <form onSubmit={(e) => e.preventDefault()}>
            <input type="text"
                   defaultValue={name || ""}
                   placeholder="your name"
                   onBlur={(e) => this.doUpdate({ name: e.target.value })}
            />
            <pre>isEmpty = {isEmpty ? 'true' : 'false'}</pre>
            <pre>Created = {created}</pre>
            <Link to={routeAddr}>{routeAddr}</Link>
          </form>
        </div>
      )
    }
  }
}

class UserProfileRaw extends Component {
  constructor(props) {
    super(props);
    this.state = { status: LOADING };
  }

  onUpdate(profileContent) {
    console.log("onUpdate profileContent=", profileContent);
    this.setState({ status: READY, ...profileContent });
  }

  componentWillMount() {
    const { address } = this.props.match.params

    console.log("Render user with address=", address);

    this.props.data.getUserProfile(`/orbitdb/${address}/user-profile`)
      .then(profile => {
        const addr = profile.address().toString();
        // TODO(laurent): broken
        const routeAddr = addr.match(/^\/orbitdb\/(.*)\/user-profile$/)[1];

        this.setState({ profile, routeAddr });
        profile.subscribe(x => this.onUpdate(x))
      })
  }

  render() {
    const { status } = this.state;

    if (status === LOADING) {
      return (
        <div>
          MyProfile: Loading...
        </div>
      )
    }
    else {
      const { isEmpty, name, created, routeAddr } = this.state;

      return (
        <div>
          <pre>{name || ""}</pre>
          <pre>isEmpty = {isEmpty ? 'true' : 'false'}</pre>
          <pre>Created = {created}</pre>
          <Link to={routeAddr}>{routeAddr}</Link>
        </div>
      )
    }
  }
}


const DEMO_BOOTSTRAP = [
  '/ip4/127.0.0.1/tcp/4023/ws/ipfs/QmaTQTXPakm7ARjs1zeqsum6MEkVAeHJSoSMW642fgG8mj',
  '/ip4/127.0.0.1/tcp/4022/ipfs/QmaTQTXPakm7ARjs1zeqsum6MEkVAeHJSoSMW642fgG8mj'
]

function withDataLoader(DecoratedComponent) {
  class DataLoader extends Component {
    constructor(props) {
      super(props);
      this.state = { status: LOADING, data: null };
    }

    componentWillMount() {
      Data.fromDefaultConfig(new PinnerNoop(), { ipfs: { bootstrap: DEMO_BOOTSTRAP } })
        .then(data => this.setState({ data, status: READY }));
    }

    render() {
      const { data, status } = this.state;

      if (status === LOADING) {
        return (<div>
          Profiles: Loading...
        </div>)
      }
      else {
        return (
          <DecoratedComponent data={data} match={this.props.match}/>
        )
      }
    }
  }

  return DataLoader;
}

export const UserProfile = withDataLoader(UserProfileRaw);
export const MyProfile = withDataLoader(MyProfileRaw);
