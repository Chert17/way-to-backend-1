import request from 'supertest';
import { app } from '../src/setting';
import { STATUS_CODE } from '../src/utils/status.code';
import { IVideo } from '../src/types/video.interface';

describe('videos', () => {
  beforeAll(async () => {
    await request(app)
      .delete('/testing/all-data')
      .expect(STATUS_CODE.NOT_CONTENT);
  });

  it('get videos should be returned status 200 and videos array', async () => {
    await request(app).get('/videos').expect(STATUS_CODE.OK, []);
  });

  it('get video by id should be returned status 404 for non-existent video', async () => {
    await request(app).get('/videos/123').expect(STATUS_CODE.NOT_FOUND);
  });

  it("shouldn't post video with incorrect input data", async () => {
    await request(app)
      .post('/videos')
      .send({
        title: null,
        author: 'Test-1',
        availableResolutions: ['P144', 'qwe'],
      })
      .expect(STATUS_CODE.BAD_REQUEST, {
        errorsMessages: [
          {
            message: 'Field must be a string and no more than 40 characters',
            field: 'title',
          },
          {
            message:
              'At least one resolution should be added P144, P240, P360, P480, P720, P1080, P1440, P2160',
            field: 'availableResolutions',
          },
        ],
      });

    await request(app).get('/videos').expect(STATUS_CODE.OK, []);
  });

  let createdVideo: IVideo;
  it('should post video with correct input data', async () => {
    const video = await request(app)
      .post('/videos')
      .send({
        title: 'Test-1',
        author: 'Test-1',
        availableResolutions: ['P144', 'P720'],
      })
      .expect(STATUS_CODE.CREATED);

    createdVideo = video.body;

    // TODO how work with data in test
    expect(createdVideo).toEqual({
      id: expect.any(Number),
      title: 'Test-1',
      author: 'Test-1',
      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt: expect.any(String),
      publicationDate: expect.any(String),
      availableResolutions: ['P144', 'P720'],
    });

    await request(app).get('/videos').expect(STATUS_CODE.OK, [createdVideo]);
    await request(app)
      .get('/videos/' + createdVideo.id)
      .expect(STATUS_CODE.OK, createdVideo);
  });

  it("shouldn't update video with incorrect input data", async () => {
    await request(app)
      .put('/videos/' + createdVideo.id)
      .send({
        title: 'Test-1',
        author: '',
        availableResolutions: ['P144', 'P720'],
        canBeDownloaded: true,
        minAgeRestriction: 18,
        publicationDate: '2023-04-27T09:06:30.115Z',
      })
      .expect(STATUS_CODE.BAD_REQUEST, {
        errorsMessages: [
          {
            message: 'Field must be a string and no more than 20 characters',
            field: 'author',
          },
        ],
      });
    await request(app)
      .get('/videos/' + createdVideo.id)
      .expect(STATUS_CODE.OK, createdVideo);
  });

  it("shouldn't update video that non-existent", async () => {
    await request(app)
      .put('/videos/' + -123)
      .send({
        title: 'Test-1',
        author: 'Test-1',
        availableResolutions: ['P144', 'P720'],
        canBeDownloaded: true,
        minAgeRestriction: 18,
        publicationDate: '2023-04-27T09:06:30.115Z',
      })
      .expect(STATUS_CODE.NOT_FOUND);
  });

  it('should update video with correct input data', async () => {
    await request(app)
      .put('/videos/' + createdVideo.id)
      .send({
        title: 'Test-up',
        author: 'Test-up',
        availableResolutions: ['P144', 'P720', 'P360'],
        canBeDownloaded: true,
        minAgeRestriction: 18,
        publicationDate: '2023-04-27T09:06:30.115Z',
      })
      .expect(STATUS_CODE.NOT_CONTENT);
    await request(app)
      .get('/videos/' + createdVideo.id)
      .expect(STATUS_CODE.OK, {
        ...createdVideo,
        title: 'Test-up',
        author: 'Test-up',
        availableResolutions: ['P144', 'P720', 'P360'],
        canBeDownloaded: true,
        minAgeRestriction: 18,
        publicationDate: '2023-04-27T09:06:30.115Z',
      });
  });

  it("shouldn't delete video with incorrect id", async () => {
    await request(app)
      .delete('/videos/' + -123)
      .expect(STATUS_CODE.NOT_FOUND);
  });

  it('should delete video with correct id', async () => {
    await request(app)
      .delete('/videos/' + createdVideo.id)
      .expect(STATUS_CODE.NOT_CONTENT);

    await request(app)
      .get('/videos/' + createdVideo.id)
      .expect(STATUS_CODE.NOT_FOUND);

    await request(app).get('/videos').expect(STATUS_CODE.OK, []);
  });
});
