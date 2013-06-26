player = gamvas.Actor.extend({
    create: function(name, x, y, controls){
        this._super(name, x, y);
        var st = gamvas.state.getCurrentState();
        this.setFile(st.resource.getImage('rsc/'+ this.name + '.png'));
        var defaultState = this.getCurrentState();
        this.setCenter(25, 25);

        var speed = 0;
            accel = 0,
            angle = 0,
            friction = -1,
            angspeed = 0.05;
        
        defaultState.update = function(t){
            accel = 0;
            if (gamvas.key.isPressed(controls.up)){
                accel = 5;
                console.log(this.actor.center, this.actor.position);
            }
            if (gamvas.key.isPressed(controls.left)){
                angle = (angle + angspeed) % (2 * Math.PI);
                this.actor.setRotation(-angle);
            }
            if (gamvas.key.isPressed(controls.right)){
                angle = (angle - angspeed) % (2 * Math.PI);
                this.actor.setRotation(-angle);
            }
            speed = speed + accel
            this.actor.move(Math.cos(angle) * speed * t, -1 * Math.sin(angle) * speed * t);
        }
    }
});

startState = gamvas.State.extend({
        init: function(){
            this.addActor(new player('p1', 10, 10, {'up': gamvas.key.UP, 'left': gamvas.key.LEFT, 'right': gamvas.key.RIGHT}));
        },
        draw: function(t){
        }
});

gamvas.event.addOnLoad(function(){
    gamvas.state.addState(new startState());
    gamvas.start('gameCanvas');
});
