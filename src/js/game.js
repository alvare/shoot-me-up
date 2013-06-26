player = gamvas.Actor.extend({
    create: function(name, x, y, controls, angle){
        this._super(name, x, y);
        var st = gamvas.state.getCurrentState();
        this.setFile(st.resource.getImage('rsc/'+ this.name + '.png'));
        var defaultState = this.getCurrentState();
        this.setCenter(20, 25);
        this.setRotation(-angle);

        var speed = 0;
            angle = angle,
            pump = 90,
            friction = 0.5,
            angspeed = 0.05;
        
        defaultState.update = function(t){
            var accel = 0;
            if (gamvas.key.isPressed(controls.up)){
                accel = pump;
            } else if (gamvas.key.isPressed(controls.down)){
                accel = -pump;
            }
            if (gamvas.key.isPressed(controls.left)){
                angle = (angle + angspeed) % (2 * Math.PI);
                this.actor.setRotation(-angle);
            } else if (gamvas.key.isPressed(controls.right)){
                angle = (angle - angspeed) % (2 * Math.PI);
                this.actor.setRotation(-angle);
            }
            speed = speed*friction + accel
            this.actor.move(Math.cos(angle) * speed * t, -1 * Math.sin(angle) * speed * t);
        }
    }
});

startState = gamvas.State.extend({
        init: function(){
            this.addActor(new player('p1', 200, 0, {'up': gamvas.key.UP, 'left': gamvas.key.LEFT, 'right': gamvas.key.RIGHT, 'down': gamvas.key.DOWN}, Math.PI));
            this.addActor(new player('p2', -200, 0, {'up': gamvas.key.W, 'left': gamvas.key.A, 'right': gamvas.key.D, 'down': gamvas.key.S}, 0));
        },
        draw: function(t){
        }
});

gamvas.event.addOnLoad(function(){
    gamvas.state.addState(new startState());
    gamvas.start('gameCanvas');
});
