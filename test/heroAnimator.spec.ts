// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {
  getElementById,
  getFilePathBasedOnFrameNumber,
} from '../src/scripts/countdown.helpers';
import { HeroAnimator } from '../src/scripts/heroAnimator';

jest.mock('../src/scripts/countdown.helpers.ts', () => ({
  ...jest.requireActual('../src/scripts/countdown.helpers.ts'),
  getElementById: jest.fn(),
}));

describe('Hero Animator', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('Basic behavior', () => {
    it('should automatically start the animation by default', () => {
      getElementById.mockImplementation(() => '<p>mocked element</p>');

      const container = {};
      container.animator = new HeroAnimator();
      expect(container.animator.isAnimationRunning).toBeTruthy();

      container.animator.stop();
      delete container.container;
    });

    it('should update the DOM image, sequentially, using the frames per second rate', async () => {
      const setAttributeMock = jest.fn();

      getElementById.mockImplementation(() => ({
        setAttribute: setAttributeMock,
      }));

      const container = {};
      container.animator = new HeroAnimator();

      // Waits for 1 second so 10 frames has been placed...
      await new Promise((resolve) => setTimeout(resolve, 1050));

      expect(setAttributeMock).toHaveBeenCalledTimes(10);
      expect(setAttributeMock.mock.calls).toEqual(
        Array.from({ length: 10 }, (_, k) => k + 1).map((number) => [
          'src',
          getFilePathBasedOnFrameNumber(number),
        ])
      );

      container.animator.stop();
      delete container.container;
    });

    it('should stop the animation handlers/intervals when reaching the 100th frame', async () => {
      const container = {};
      container.animator = new HeroAnimator({
        initialFrame: 99,
      });

      expect(container.animator.isAnimationRunning).toBeTruthy();

      // Waits for 0.5 seconds so some frames getsplaced...
      await new Promise((resolve) => setTimeout(resolve, 500));

      expect(container.animator.isAnimationRunning).toBeFalsy();
      expect(container.animator.imagesSwitchInteval).toBeNull();

      container.animator.stop();
      delete container.container;
    });
  });
});
