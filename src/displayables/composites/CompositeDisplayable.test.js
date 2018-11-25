import CompositeDisplayable from './CompositeDisplayable';
import Displayable from "../Displayable";

describe("CompositeDisplayable", () => {
    let composite, child1, child2, display1, display2, update1, update2, ctx;

    const COMPOSITE_X_INITIAL = 43, COMPOSITE_Y_INITIAL = -192;
    const CHILD_1_X_INITIAL = 12, CHILD_1_Y_INITIAL = 23;
    const CHILD_2_X_INITIAL = -40, CHILD_2_Y_INITIAL = 0;

    beforeEach(() => {
       composite = new CompositeDisplayable(COMPOSITE_X_INITIAL, COMPOSITE_Y_INITIAL);

       display1 = jest.fn();
       display2 = jest.fn();
       update1 = jest.fn();
       update2 = jest.fn();

       ctx = {
           save: jest.fn(),
           translate: jest.fn(),
           restore: jest.fn(),
       };

       child1 = new Displayable(CHILD_1_X_INITIAL, CHILD_1_Y_INITIAL, display1, update1);
       child2 = new Displayable(CHILD_2_X_INITIAL, CHILD_2_Y_INITIAL, display2, update2);
    });

    it("initializes X and Y correctly", () => {
       expect(composite.getX()).toEqual(COMPOSITE_X_INITIAL);
       expect(composite.getY()).toEqual(COMPOSITE_Y_INITIAL);

       expect(child1.getX()).toEqual(CHILD_1_X_INITIAL);
       expect(child1.getY()).toEqual(CHILD_1_Y_INITIAL);

       expect(child2.getX()).toEqual(CHILD_2_X_INITIAL);
       expect(child2.getY()).toEqual(CHILD_2_Y_INITIAL);
    });

    it("sets X and Y correctly", () => {
        const NEW_X = 140, NEW_Y = 1985;

        composite.setX(NEW_X);
        composite.setY(NEW_Y);

        expect(composite.getX()).toEqual(NEW_X);
        expect(composite.getY()).toEqual(NEW_Y);
    });

    it("displays and updates with no children", () => {
       composite.display(ctx);

       expect(ctx.save).toHaveBeenCalledTimes(1);
       expect(ctx.restore).toHaveBeenCalledTimes(1);
       expect(ctx.translate).toHaveBeenCalledTimes(1);
       expect(ctx.translate).toHaveBeenCalledWith(composite.getX(), composite.getY());

       composite.update();
    });

    it("displays and updates with one child", () => {
       composite.add(child1);

       composite.update();

       expect(update1).toHaveBeenCalledTimes(1);

       composite.display(ctx);

       expect(display1).toHaveBeenCalledTimes(1);
       expect(display1).toHaveBeenCalledWith(ctx);

       expect(ctx.save).toHaveBeenCalledTimes(2);
       expect(ctx.restore).toHaveBeenCalledTimes(2);
       expect(ctx.translate).toHaveBeenCalledTimes(2);
       expect(ctx.translate).toHaveBeenCalledWith(composite.getX(), composite.getY());
       expect(ctx.translate).toHaveBeenLastCalledWith(child1.getX(), child1.getY());
    });

    it("displays and updates with multiple children", () => {
        composite.add(child1);
        composite.add(child2);

        composite.update();

        expect(update1).toHaveBeenCalledTimes(1);
        expect(update2).toHaveBeenCalledTimes(1);

        composite.display(ctx);

        expect(display1).toHaveBeenCalledTimes(1);
        expect(display1).toHaveBeenCalledWith(ctx);
        expect(display2).toHaveBeenCalledTimes(1);
        expect(display2).toHaveBeenCalledWith(ctx);

        expect(ctx.save).toHaveBeenCalledTimes(3);
        expect(ctx.restore).toHaveBeenCalledTimes(3);
        expect(ctx.translate).toHaveBeenCalledTimes(3);
        expect(ctx.translate).toHaveBeenCalledWith(composite.getX(), composite.getY());
        expect(ctx.translate).toHaveBeenCalledWith(child1.getX(), child1.getY());
        expect(ctx.translate).toHaveBeenLastCalledWith(child2.getX(), child2.getY());

        composite.remove(child1);

        composite.update();

        expect(update1).toHaveBeenCalledTimes(1);
        expect(update2).toHaveBeenCalledTimes(2);

        ctx.translate.mockClear();

        composite.display(ctx);

        expect(display1).toHaveBeenCalledTimes(1);
        expect(display1).toHaveBeenCalledWith(ctx);
        expect(display2).toHaveBeenCalledTimes(2);
        expect(display2).toHaveBeenCalledWith(ctx);

        expect(ctx.save).toHaveBeenCalledTimes(5);
        expect(ctx.restore).toHaveBeenCalledTimes(5);
        expect(ctx.translate).toHaveBeenCalledTimes(2);
        expect(ctx.translate).toHaveBeenCalledWith(composite.getX(), composite.getY());
        expect(ctx.translate).toHaveBeenLastCalledWith(child2.getX(), child2.getY());
    });
});