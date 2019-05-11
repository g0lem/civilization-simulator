export default function(game, player){

    var pointerGroup = game.add.group();

    pointerGroup.enableBody = true;

    var pointer = null;

    const createPointer = ({x, y}) => {
        pointerGroup.removeAll();
        pointer = pointerGroup.create(x, y, 'cross');
    }

    const getToPointer =  (_player, _pointer) => {
        _pointer.kill();
        player.stopPlayer();
        pointerGroup.removeAll();
        pointer = null;
    }

    const getPointer = () => {
        return pointer;
    }
    const getPointerGroup = () => {
        return pointerGroup;
    }

    return {
        createPointer,
        pointerGroup,
        getToPointer,
        getPointer,
        getPointerGroup,
    };
}
