player = gamvas.Actor.extend({
    create: function(name, x, y, controls, angle){
        this._super(name, x, y);
        var st = gamvas.state.getCurrentState();
        this.setFile(st.resource.getImage('rsc/'+ this.name + '.png'));
        var defaultState = this.getCurrentState();
        var offset = {'x': 20, 'y': 25};
        this.setCenter(offset.x, offset.y);
        this.setRotation(-angle);

        st.images[name.slice(-1)] = st.resource.getImage('rsc/shoot-' + name + '.png');

        var speed = 0,
            pump = 90,
            sCount = 0,
            friction = 0.5,
            maxS = 5,
            interval = 0,
            angspeed = 0.05;
        
        defaultState.update = function(t){
            var accel = 0;
            var posX = this.actor.position.x
            var posY = this.actor.position.y
            if (gamvas.key.isPressed(controls.up)){
                accel = pump;
                if (gamvas.timer.getSeconds() - interval > 0.3){
                    st.addActor(new shoot('shoot-' + name + ',' + sCount, posX, posY, angle));
                    sCount++;
                    interval = gamvas.timer.getSeconds();
                }
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
            speed = speed * friction + accel
            this.actor.move(Math.cos(angle) * speed * t, -1 * Math.sin(angle) * speed * t);
        };
    }
});

shoot = gamvas.Actor.extend({
    create: function(name, x, y, angle){
        this._super(name, x, y);
        var st = gamvas.state.getCurrentState();
        this.setFile(st.images[name.split(',')[0].slice(-1)]);
        var defaultState = this.getCurrentState();
        this.setCenter(2, 2);
        this.setRotation(-angle);

        this.parentName = name.split(',')[0].split('-')[1];
        st.cachedActors = st.getActors();

        var speed = 300,
            time = gamvas.timer.getSeconds(),
            lifeTime = 4;
        
        defaultState.update = function(t){
            this.actor.move(Math.cos(angle) * speed * t, -1 * Math.sin(angle) * speed * t);
            if(gamvas.timer.getSeconds() - time > lifeTime)
                st.removeActor(this.actor);
        };
    }
});

startState = gamvas.State.extend({
        init: function(){
            this.images = {};
            var state = this;
            _(this.getActors()).each(function(a){state.removeActor(a.name)});
            this.cleanUp();

            this.addActor(new player('p1', 200, 0, {'up': gamvas.key.UP, 'left': gamvas.key.LEFT, 'right': gamvas.key.RIGHT, 'down': gamvas.key.DOWN}, Math.PI));
            this.addActor(new player('p2', -200, 0, {'up': gamvas.key.W, 'left': gamvas.key.A, 'right': gamvas.key.D, 'down': gamvas.key.S}, 0));

            this.timer = gamvas.timer.getMilliseconds();
            this.cachedActors = this.getActors();
            this.loser = "none";
        },
        draw: function(t){
            if(this.loser == "none"){
                var actors = _(this.cachedActors).groupBy(function(a){
                    return a.name[0];
                });

                var state = this;
                _(actors.p).each(function(p){
                    if(_(actors.s).some(function(s){return s.parentName != p.name && collides(s.position, p.position)})){
                        state.removeActor(p.name);
                        state.loser = p.name;
                    }
                });

                this.timer = gamvas.timer.getMilliseconds();
            } else {
                this.c.fillStyle = '#fff';
                this.c.font = 'bold 20px sans-serif';
                this.c.textAlign = 'center';
                this.c.fillText("Looser = " + this.loser, 0, 0);
            }
        },
        onKeyDown: function(k) {
            if (k == gamvas.key.R) {
            console.log(this);
                this.loser = "none";
                this.init();
            }
            return gamvas.key.exitEvent();
        }        
});

var collides = function(va, vb){
    if(va.distance(vb) < 40)
        return true
    else
        return false;
};

gamvas.event.addOnLoad(function(){
    gamvas.state.addState(new startState());
    gamvas.start('gameCanvas');
});
