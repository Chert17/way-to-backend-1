import request from 'supertest';
import { app } from '../src/setting';
import { STATUS_CODE } from '../src/utils/status.code';
import { IPost } from '../src/types/post.interface';

const POSTS_URL = '/posts';

const validPostData = {
  title: 'Test-1',
  shortDescription: 'Test-1',
  content: 'Test-1',
  blogId: '1',
};

describe('posts', () => {
  beforeAll(async () => {
    await request(app)
      .delete('/testing/all-data')
      .expect(STATUS_CODE.NOT_CONTENT);
  });

  it('GET ALL POSTS should be returned status 200 and posts array', async () => {
    await request(app).get(POSTS_URL).expect(STATUS_CODE.OK, []);
  });

  it('GET POSTS BY ID should be returned status 404 for non-existent post', async () => {
    await request(app)
      .get(`${POSTS_URL}/${-123}`)
      .expect(STATUS_CODE.NOT_FOUND);
  });

  describe('auth', () => {
    beforeEach(async () => {
      request(app); //! как проверить если не auth //!
    });

    it("!POST POSTS shouldn't post post with incorrect input data", async () => {
      await request(app)
        .post(POSTS_URL)
        .auth('admin', 'qwerty', { type: 'basic' })
        .send({
          title: null,
          shortDescription: 'string',
          content: '     ',
          blogId: 'string',
        })
        .expect(STATUS_CODE.BAD_REQUEST, {
          errorsMessages: [
            {
              message: 'Invalid value',
              field: 'title',
            },
            {
              message: 'Field is required',
              field: 'content',
            },
            {
              message: 'Blog with given id not found',
              field: 'blogId',
            },
          ],
        });

      await request(app).get(POSTS_URL).expect(STATUS_CODE.OK, []);
    });

    let createdPost: IPost;
    it('POST POSTS should post post with correct input data', async () => {
      const blog = await request(app)
        .post(POSTS_URL)
        .auth('admin', 'qwerty', { type: 'basic' })
        .send({ ...validPostData })
        .expect(STATUS_CODE.CREATED);

      createdPost = blog.body;

      expect(createdPost).toEqual({
        id: expect.any(String),
        ...validPostData,
      });

      await request(app).get(POSTS_URL).expect(STATUS_CODE.OK, [createdPost]);
      await request(app)
        .get(`${POSTS_URL}/` + createdPost.id)
        .expect(STATUS_CODE.OK, createdPost);
    });

    it("!PUT POST shouldn't update post with incorrect input data", async () => {
      await request(app)
        .put(`${POSTS_URL}` + createdPost.id)
        .auth('admin', 'qwerty', { type: 'basic' })
        .send({
          title: 'Test-up',
          shortDescription: '   ',
          content: 'Test-up',
          blogId: '1',
        })
        .expect(STATUS_CODE.BAD_REQUEST, {
          errorsMessages: [
            {
              message: 'Field is required',
              field: 'shortDescription',
            },
          ],
        });
      await request(app)
        .get(`${POSTS_URL}` + createdPost.id)
        .expect(STATUS_CODE.OK, createdPost);
    });

    it("!PUT POST shouldn't update post that non-existent", async () => {
      await request(app)
        .put(`${POSTS_URL}` + -123)
        .auth('admin', 'qwerty', { type: 'basic' })
        .send({ ...createdPost })
        .expect(STATUS_CODE.NOT_FOUND);
    });

    it('PUT POST should update post with correct input data', async () => {
      await request(app)
        .put(`${POSTS_URL}` + createdPost.id)
        .auth('admin', 'qwerty', { type: 'basic' })
        .send({
          title: 'Test-up',
          shortDescription: 'Test-up',
          content: 'Test-up',
          blogId: '1',
        })
        .expect(STATUS_CODE.NOT_CONTENT);

      await request(app)
        .get(`${POSTS_URL}` + createdPost.id)
        .expect(STATUS_CODE.OK, {
          ...createdPost,
          title: 'Test-up',
          shortDescription: 'Test-up',
          content: 'Test-up',
          blogId: '1',
        });
    });

    it("!DELETE POST shouldn't delete post with incorrect id", async () => {
      await request(app)
        .delete(`${POSTS_URL}` + -123)
        .auth('admin', 'qwerty', { type: 'basic' })
        .expect(STATUS_CODE.NOT_FOUND);
    });

    it('DELETE POST should delete post with correct id', async () => {
      await request(app)
        .delete(`${POSTS_URL}` + createdPost.id)
        .auth('admin', 'qwerty', { type: 'basic' })
        .expect(STATUS_CODE.NOT_CONTENT);

      await request(app)
        .get(`${POSTS_URL}` + createdPost.id)
        .expect(STATUS_CODE.NOT_FOUND);

      await request(app).get(`${POSTS_URL}`).expect(STATUS_CODE.OK, []);
    });
  });
});
