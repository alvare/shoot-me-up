player = gamvas.Actor.extend({
    create: function(name, x, y, controls){
        this._super(name, x, y);
        var st = gamvas.state.getCurrentState();
        this.setFile(st.resource.getImage('rsc/'+ this.name + '.png'));
        var defaultState = this.getCurrentState();

        var speed = 100;
        
        defaultState.update = function(t){
            if (gamvas.key.isPressed(contols))
                console.log(p);
            if (gamvas.key.isPressed(gamvas.key.LEFT))
                this.actor.move(speed*t, 0);
        }
    }
});

helloState = gamvas.State.extend({
        init: function(){
            this.addActor(new player('p1', 10, 10, {'up': gamvas.key.UP, 'left': gamvas.key.LEFT}));
            this.addActor(new player('p2', -20, 10, 3));
        },
        draw: function(t){
            this.c.fillStyle = '#fff';
            this.c.font = 'bold 20px sans-serif';
            this.c.textAlign = 'center';
            this.c.fillText("Hello World!", 0, 0);
        }
});

gamvas.event.addOnLoad(function(){
    gamvas.state.addState(new helloState('helloworld'));
    gamvas.start('gameCanvas');
});
