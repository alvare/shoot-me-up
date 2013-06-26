player = gamvas.Actor.extend({
    create: function(name, x, y, controls){
        this._super(name, x, y);
        var st = gamvas.state.getCurrentState();
        this.setFile(st.resource.getImage('rsc/'+ this.name + '.png'));
        var defaultState = this.getCurrentState();

        var speed = 0;
            accel = 0,
            angle = 0;
            friction = -1;
        
        defaultState.update = function(t){
            accel = 0;
            if (gamvas.key.isPressed(controls.up))
                accel = 5;
            if (gamvas.key.isPressed(controls.left)){
                angle = (angle + 0.1) % (2 * Math.PI);
                this.actor.setRotation(angle);
            }
            if (gamvas.key.isPressed(controls.right)){
                angle = (angle - 0.1) % (2 * Math.PI);
                this.actor.setRotation(angle);
            }
            speed = speed + accel
            this.actor.move(Math.sin(angle) * speed * t, Math.cos(angle) * speed * t);
        }
    }
});

helloState = gamvas.State.extend({
        init: function(){
            this.addActor(new player('p1', 10, 10, {'up': gamvas.key.UP, 'left': gamvas.key.LEFT, 'right': gamvas.key.RIGHT}));
            //this.addActor(new player('p2', -20, 10, 3));
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
