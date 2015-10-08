import HubUsersGroupsSource from './hub-users-groups-source';
import {TOP_ALL} from 'hub-source/hub-source';

describe('HubUsersGroupsSource', function () {

  beforeEach(function () {
    this.fakeAuth = {
      requestToken: this.sinon.stub().returns(Promise.resolve('testToken')),
      getApi: this.sinon.stub().returns(Promise.resolve({}))
    }
  });

  it('Should make request for users', function () {
    let source = new HubUsersGroupsSource(this.fakeAuth);
    this.sinon.stub(source.usersSource, 'get').returns(Promise.resolve([]));

    return source.getUsers()
      .then(() => {
        source.usersSource.get.should.have.been.calledWith('', {
          fields: 'id,name,login,total,profile/avatar/url',
          orderBy: 'name'
        });
      });
  });

  it('Should pass query for users', function () {
    let source = new HubUsersGroupsSource(this.fakeAuth);
    this.sinon.stub(source.usersSource, 'get').returns(Promise.resolve([]));

    return source.getUsers('nam')
      .then(() => {
        source.usersSource.get.should.have.been.calledWith('nam', {
          fields: sinon.match.string,
          orderBy: sinon.match.string
        });
      });
  });

  it('Should make request for groups', function () {
    let source = new HubUsersGroupsSource(this.fakeAuth);
    this.sinon.stub(source.groupsSource, 'get').returns(Promise.resolve([]));

    return source.getGroups()
      .then(() => {
        source.groupsSource.get.should.have.been.calledWith('', {
          fields: 'id,name,total,userCount',
          orderBy: 'name'
        });
      });
  });

  it('Should cache request for groups', function () {
    this.fakeAuth.getApi = this.sinon.stub().returns(Promise.resolve({total: 1, usergroups: []}));

    let source = new HubUsersGroupsSource(this.fakeAuth);
    source.getGroups();
    source.getGroups();
    return source.getGroups()
      .then(() => {
        this.fakeAuth.getApi.should.have.been.called.once;
      });
  });
});
