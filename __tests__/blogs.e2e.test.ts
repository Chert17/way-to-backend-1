import request from 'supertest';
import { app } from '../src/setting';
import { STATUS_CODE } from '../src/utils/status.code';
import { IBlog } from '../src/types/blog.interface';

const validWebsiteUrl =
  'https://xIXpKL4Ubp0KplEoZ8pXJmZNrT_AV.A1DJuSR-4bRwAuebpljvxtLWqHZNOKq7ErjqkR-EBw0.w5m1DrT2e7tAb2F.cD';

const validBlogPostData = {
  name: 'Test-1',
  description: 'Test-1',
  websiteUrl: validWebsiteUrl,
};

describe('blogs', () => {
  beforeAll(async () => {
    await request(app)
      .delete('/testing/all-data')
      .expect(STATUS_CODE.NOT_CONTENT);
  });

  it('GET ALL BLOGS should be returned status 200 and blogs array', async () => {
    await request(app).get('/blogs').expect(STATUS_CODE.OK, []);
  });

  it('GET BLOG BY ID should be returned status 404 for non-existent blog', async () => {
    await request(app)
      .get('/blogs/' + -123)
      .expect(STATUS_CODE.NOT_FOUND);
  });

  describe('auth', () => {
    beforeEach(async () => {
      request(app); //! как проверить если не auth //!
    });

    it("!POST BLOG shouldn't post blog with incorrect input data", async () => {
      await request(app)
        .post('/blogs')
        .auth('admin', 'qwerty', { type: 'basic' })
        .send({
          name: null,
          description: '    ',
          websiteUrl: validWebsiteUrl,
        })
        .expect(STATUS_CODE.BAD_REQUEST, {
          errorsMessages: [
            {
              message: 'Invalid value',
              field: 'name',
            },
            {
              message: 'Field is required',
              field: 'description',
            },
          ],
        });

      await request(app).get('/blogs').expect(STATUS_CODE.OK, []);
    });

    let createdBlog: IBlog;
    it('POST BLOG should post blog with correct input data', async () => {
      const blog = await request(app)
        .post('/blogs')
        .auth('admin', 'qwerty', { type: 'basic' })
        .send({ ...validBlogPostData })
        .expect(STATUS_CODE.CREATED);

      createdBlog = blog.body;

      expect(createdBlog).toEqual({
        id: expect.any(String),
        ...validBlogPostData,
      });

      await request(app).get('/blogs').expect(STATUS_CODE.OK, [createdBlog]);
      await request(app)
        .get('/blogs/' + createdBlog.id)
        .expect(STATUS_CODE.OK, createdBlog);
    });

    it("!PUT BLOG shouldn't update blog with incorrect input data", async () => {
      await request(app)
        .put('/blogs/' + createdBlog.id)
        .auth('admin', 'qwerty', { type: 'basic' })
        .send({
          name: 'Test-up',
          description: 'Test-up',
          websiteUrl: null,
        })
        .expect(STATUS_CODE.BAD_REQUEST, {
          errorsMessages: [
            {
              message: 'Invalid value',
              field: 'websiteUrl',
            },
          ],
        });
      await request(app)
        .get('/blogs/' + createdBlog.id)
        .expect(STATUS_CODE.OK, createdBlog);
    });

    it("!PUT BLOG shouldn't update blog that non-existent", async () => {
      await request(app)
        .put('/blogs/' + -123)
        .auth('admin', 'qwerty', { type: 'basic' })
        .send({ ...createdBlog })
        .expect(STATUS_CODE.NOT_FOUND);
    });

    it('PUT BLOG should update blog with correct input data', async () => {
      await request(app)
        .put('/blogs/' + createdBlog.id)
        .auth('admin', 'qwerty', { type: 'basic' })
        .send({
          name: 'Test-up',
          description: 'Test-up',
          websiteUrl: validWebsiteUrl,
        })
        .expect(STATUS_CODE.NOT_CONTENT);

      await request(app)
        .get('/blogs/' + createdBlog.id)
        .expect(STATUS_CODE.OK, {
          ...createdBlog,
          name: 'Test-up',
          description: 'Test-up',
          websiteUrl: validWebsiteUrl,
        });
    });

    it("!DELETE BLOG shouldn't delete blog with incorrect id", async () => {
      await request(app)
        .delete('/blogs/' + -123)
        .auth('admin', 'qwerty', { type: 'basic' })
        .expect(STATUS_CODE.NOT_FOUND);
    });

    it('DELETE BLOG should delete blog with correct id', async () => {
      await request(app)
        .delete('/blogs/' + createdBlog.id)
        .auth('admin', 'qwerty', { type: 'basic' })
        .expect(STATUS_CODE.NOT_CONTENT);

      await request(app)
        .get('/blogs/' + createdBlog.id)
        .expect(STATUS_CODE.NOT_FOUND);

      await request(app).get('/blogs').expect(STATUS_CODE.OK, []);
    });
  });
});
