import Displayable from "./Displayable";

describe('Displayable', () => {

    const X_INITIAL = 0, Y_INITIAL = 50;

    let displayable, onDisplay, onUpdate;

    beforeEach(() => {
        onDisplay = jest.fn();
        onUpdate = jest.fn();
        displayable = new Displayable(X_INITIAL, Y_INITIAL, onDisplay, onUpdate);
    });

    it('initializes X and Y correctly', () => {
        expect(displayable.getX()).toEqual(X_INITIAL);
        expect(displayable.getY()).toEqual(Y_INITIAL);
    });

    it('sets X and Y correctly', () => {
        const X_NEW = 25, Y_NEW = -100;

        displayable.setX(X_NEW);

        expect(displayable.getX()).toEqual(X_NEW);

        displayable.setY(Y_NEW);

        expect(displayable.getY()).toEqual(Y_NEW);
    });

    it('translates correctly', () => {
       const DX = 10, DY = 50, X = displayable.getX(), Y = displayable.getY();

       displayable.translate(DX, DY);

       expect(displayable.getX()).toEqual(X + DX);
       expect(displayable.getY()).toEqual(Y + DY);
    });

    it('calls supplied function on update()', () => {
       expect(onUpdate).not.toHaveBeenCalled();

       displayable.update();

       expect(onUpdate).toBeCalledTimes(1);
    });

    it('calls supplied function on display()', () => {
        expect(onDisplay).not.toHaveBeenCalled();

        const CTX = {
            save: jest.fn(),
            translate: jest.fn(),
            restore: jest.fn(),
        };

        displayable.display(CTX);

        expect(onDisplay).toBeCalledTimes(1);
        expect(onDisplay).lastCalledWith(CTX);

        expect(CTX.save).toBeCalledTimes(1);
        expect(CTX.translate).toBeCalledTimes(1);
        expect(CTX.translate).toBeCalledWith(displayable.getX(), displayable.getY());
        expect(CTX.restore).toBeCalledTimes(1);
    });
});

