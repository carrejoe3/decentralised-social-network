const { assert } = require('chai');

const SocialNetwork = artifacts.require("SocialNetwork");

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract ('SocialNetwork', ([deployer, author, tipper]) => {
  let socialNetwork

  before(async () => {
    socialNetwork = await SocialNetwork.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await socialNetwork.address
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
      assert.notEqual(address, 0x0)
    })

    it('has a name', async () => {
      const name = await socialNetwork.name()
      assert.equal(name, 'Social Network')
    })
  })

  describe('posts', async () => {
    let result, postCount

    it('creates posts', async () => {
      result = await socialNetwork.createPost('This is a post', { from: author })
      postCount = await socialNetwork.postCount()

      // SUCCESS
      assert.equal(postCount, 1)

      const event = result.logs[0].args

      assert.equal(event.id.toNumber(), postCount.toNumber(), 'id is correct')
      assert.equal(event.content, 'This is a post', 'content is correct')
      assert.equal(event.tipAmount, '0', 'tip amount is correct')
      assert.equal(event.author, author, 'author is correct')

      // FAIL: posts must have content
      result = await socialNetwork.createPost('', { from: author }).should.be.rejected;
    })

    it('lists posts', async () => {

    })

    it('allows users to tip posts', async () => {

    })
  })
})
