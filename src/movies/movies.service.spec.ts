import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';

const log = console.log;

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Get all', () => {
    it('It should return array: []', () => {
      const result = service.getAll();
      expect(result).toBeInstanceOf(Array);
    });
  });
  describe('Get one', () => {
    it('It should be return a movie', () => {
      service.create({
        title: 'test',
        genres: ['test'],
        year: 2000,
      });
      const movie = service.getOne(1);
      expect(movie).toBeDefined();
      expect(movie.id).toEqual(1);
    });
    it('It should throw 404', () => {
      try {
        service.getOne(999);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual(`Movie with 999 not found.`);
      }
    });
  });
  describe('Delete a movie', () => {
    it('It should delete a movie', () => {
      service.create({
        title: 'test',
        genres: ['tests'],
        year: 2021,
      });
      const beforeDelete = service.getAll().length;
      service.deleteOne(1);
      const afterDelete = service.getAll().length;
      expect(afterDelete).toBeLessThan(beforeDelete);
    });
    it('If not exist, shoud throw 404', () => {
      try {
        service.deleteOne(1);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual(`Movie with 1 not found.`);
      }
    });
  });
  describe('Create a movie', () => {
    it('It should create a movie', () => {
      const beforeCreate = service.getAll().length;
      service.create({
        title: 'test',
        genres: ['test'],
        year: 2022,
      });
      const afterCreate = service.getAll().length;
      log(' Before:', beforeCreate, 'After:', afterCreate);
      expect(afterCreate).toBeGreaterThan(beforeCreate);
    });
  });
  describe('Update a movie', () => {
    it('It should update a movie', () => {
      service.create({
        title: 'test',
        genres: ['tests'],
        year: 2020,
      });
      log('Before:', service.getOne(1));
      service.update(1, { title: 'updated!' });
      log('After:', service.getOne(1));
      const movie = service.getOne(1);
      expect(movie.title).toEqual('updated!');
    });
  });
});
