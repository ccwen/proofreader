var {store,action,getter,hasGetter,registerGetter,unregisterGetter}=require("./model");

var rule={
	setRule:function(_rule){
		this.rule=_rule;
		if (_rule.init) _rule.init();
		unregisterGetter("automark");
		registerGetter("automark",_rule.automark);
	}
};
module.exports=rule;