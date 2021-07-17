/* Script by YOUR MOM*/
'use strict'
module.exports = function aazsync(dispatch) {
	let config = {};
	let snarelist = {};
	let slowtable = {};
	let settingTimeout = null;
	let settingLock = false;

	const path = require('path');
	const fs = require('fs');

	try { config = require('./config.json'); }
	catch (e) {
		config = {};
		settingUpdate();
	}

	try { snarelist = require('./snare.json'); }
	catch (e) {
		snarelist = {};
		settingUpdate();
	}

	try { slowtable = require('./slow.json'); }
	catch (e) {
		slowtable = {};
		settingUpdate();
	}

	function settingUpdate() {
		clearTimeout(settingTimeout);
		settingTimeout = setTimeout(settingSave,1000);
	}

	function settingSave() {
		if (settingLock) {
			settingUpdate();
			return;
		}

		settingLock = false;
		fs.writeFile(path.join(__dirname, 'config.json'), JSON.stringify(config, undefined, '\t'), err => {
			settingLock = false;
		});
		fs.writeFile(path.join(__dirname, 'snare.json'), JSON.stringify(snarelist, undefined, '\t'), err => {
			settingLock = false;
		});
		fs.writeFile(path.join(__dirname, 'slow.json'), JSON.stringify(slowtable, undefined, '\t'), err => {
			settingLock = false;
		});
	}

	if (!("UNSTUCK_COMMAND" in config)) {
		config.UNSTUCK_COMMAND = "Although this should not happen, players can be manually unstuck with unstuck1 command.";
		settingUpdate();
	}

	let FORCE_CLIP_WALL = false;
	if (("FORCE_CLIP_WALL" in config)) {
		FORCE_CLIP_WALL = config.FORCE_CLIP_WALL;
	}
	if (!("FORCE_CLIP_WALL" in config)) {
		config.FORCE_CLIP_WALL = false;
		config.FORCE_CLIP_WALL_DESCRIPTION = "Forceclip prevents you from passing through walls by clipping you back. This will also resync you to correct location after a slow modified movement skill.";
		settingUpdate();
	}

	let FORCE_SYNC_ALWAYS = false;
	if (("FORCE_SYNC_ALWAYS" in config)) {
		FORCE_SYNC_ALWAYS = config.FORCE_SYNC_ALWAYS;
	}
	if (!("FORCE_SYNC_ALWAYS" in config)) {
		config.FORCE_SYNC_ALWAYS = false;
		config.FORCE_SYNC_ALWAYS_DESCRIPTION = "Will resync you after every CC, will cause a lot of micro movement.";
		config.FORCE_SYNC_ALWAYS_DESCRIPTION_2 = "Do not use this with ADVANCED_CC due to the conflicting nature between prediction and correction.";
		config.FORCE_SYNC_ALWAYS_DESCRIPTION_3 = "This option is highly NOT recommended in PvE.";
		settingUpdate();
	}
	let ADVANCED_CC = false;
	if (("ADVANCED_CC" in config)) {
		ADVANCED_CC = config.ADVANCED_CC;
	}
	if (!("ADVANCED_CC" in config)) {
		config.ADVANCED_CC = false;
		config.ADVANCED_CC_DESCRIPTION = "Will handle CC duration to perfectly match server response, useful to get out of combos in PvP (must be used in conjunction with MY_PING parameter).";
		config.ADVANCED_CC_DESCRIPTION_2 = "If the ADVANCED_CC prediction makes an error (i.e. due to unexpected chain CC handling) you will be resynced back to correct location.";
		config.ADVANCED_CC_DESCRIPTION_3 = "Can be toggled on and off in game with advancedcc1 command.";
		settingUpdate();
	}
	let MY_PING =0;
	if (("MY_PING" in config)) {
		MY_PING = config.MY_PING;
	}
	if (!("MY_PING" in config)) {
		config.MY_PING =0;
		config.MY_PING_DESCRIPTION = "THIS VARIABLE IS NOT USED IF ADVANCED_CC IS FALSE. This value should be equal to your LOWEST ping range.";
		settingUpdate();
	}
	let DISABLE_SNARE_FIX = true;
	if (("DISABLE_SNARE_FIX" in config)) {
		DISABLE_SNARE_FIX = config.DISABLE_SNARE_FIX;
	}
	if (!("DISABLE_SNARE_FIX" in config)) {
		config.DISABLE_SNARE_FIX = true;
		config.DISABLE_SNARE_FIX_DESCRIPTION = "Setting this to true disables snare fix and lets you desync snares.";
		settingUpdate();
	}
	let DISABLE_SLOW_FIX = true;
	if (("DISABLE_SLOW_FIX" in config)) {
		DISABLE_SLOW_FIX = config.DISABLE_SLOW_FIX;
	}
	if (!("DISABLE_SLOW_FIX" in config)) {
		config.DISABLE_SLOW_FIX = true;
		config.DISABLE_SLOW_FIX_DESCRIPTION = "Setting this to true disables slow fix and lets you desync slows.";
		settingUpdate();
	}
	const S_RETAL = {
		"0": [130100, 130200, 130300, 130400, 130500, 130600, 130700, 130800, 130900, 131000],
		"1": [110100, 110200, 110300, 110400, 110500, 110600, 110700, 110800, 110900, 111000],
		"2": [100100, 100200, 100300, 100400, 100500, 100600, 100700, 100800, 100900, 101000],
		"3": [130100, 130200, 130300, 130400, 130500, 130600, 130700, 130800, 130900, 131000],
		"4": [140100, 140200, 140300, 140400, 140500, 140600, 140700, 140800, 140900, 141000],
		"5": [140100, 140200, 140300, 140400, 140500, 140600, 140700, 140800, 140900, 141000],
		"6": [250100, 250200, 250300, 250400, 250500, 250600, 250700, 250800, 250900, 251000],
		"7": [210100, 210200, 210300, 210400, 210500, 210600, 210700, 210800, 210900, 211000],
		"8": [140100, 140200, 140300],
		"9": [200100, 200200, 200300, 200400, 200500, 200600, 200700, 200800, 200900, 201000],
		"10": [120100, 120200, 120300, 120400, 120500, 120600, 120700, 120800, 120900, 121000],
		"11": [100100, 100200, 100300, 100400, 100500, 100600, 100700, 100800, 100900, 101000],
		"12": [180100, 180199, 180200, 180299, 180300, 180399, 180400, 180499, 180500, 180599, 180600, 180699, 180700, 180799, 180800, 180899, 180900, 180999, 181000, 181099, 185100, 185200, 185300, 185400, 185500, 185600, 185700, 185800, 185900, 186000]
	};
	
	const PVP_BLOCK = {
		"0": [400110, 400120, 410100, 420100], //waltz, arial scythe, blade frenzy
		"1": [280100, 300100, 290100], //super jump, blue shield, other shield
		"2": [260100, 270100, 280100],  //decimate, savage strike, bigsword
		"3": [330100], //unleashed
		"4": [360200, 360230, 360300, 360400, 360600, 390100], //fusion skills
		"5": [350100, 360100, 340100, 340110, 340120, 340130, 340140, 340150, 340160, 340170, 340180], //windsong, big arrow, windwalk
		"6": [], //priest script mia
		"7": [470100, 440100, 480100, 450100, 450150], //mote blast, transmission, thrall king, soul
		"8": [230100, 190100, 210100], //ulti, dark harvest, scythe retrieval
		"9": [410101, 410102], //modweapsys
		"10": [220100, 240101, 240102, 260100], //flykick, oneinch, rythmic
		"11": [230100, 220110, 210100, 210115, 210117, 210150, 210151, 210112, 210113], //buddha, chidori, shuriken
		"12": [230100, 235100, 240100, 245100, 250100, 250102], //halfmoon, aggro, warcry
	};
	
	let cid;
	let model;
	let name;
	let job;

	let lastAbnormality;
	let abnormalityCounter =0;
	let killNext;
	let lastSkill;
	let lastStage;

	let xloz = false;
	let yloz = false;
	let zloz = false;
	let wloz = false;

	let skillLock = false;
	let hardCC = false;
	let queueSkill;
	let releaseQueue = false;

	let fullLock = false;
	let staggerlock = false;
	let staggerlock2;
	let stageLock = false;

	let lastInput =0;

	let checkpointx =0;

	let endOrder;

	let cctoggle = ADVANCED_CC;
	let cctoggle2 =0;

	let silenceID = ",78300321,73501008,93501008,90340702,90340903,98300321,78200321,78200116,98200321,2052,2069,2097,2098,15000,70406,70407,70408,70449,70451,70454,82601,82607,82609,88605,88610,400600,400601,400602,400603,400604,400620,400621,400622,400623,400624,429006,457010,460002,460019,460023,460025,470015,470017,470018,470020,470026,470027,470028,476111,476112,500900,501500,620000,620001,622002,623005,626004,701300,701320,757010,760002,760019,760023,760025,781010,781076,781099,801900,801920,811060,830007,830016,830017,860002,860019,860023,860025,905408,905426,905606,905620,905628,905922,905924,905928,905934,905947,905960,950107,950317,950436,980006,980207,981010,981076,981099,988574,988575,6270007,7102059,7103040,7201004,7201005,44300031,7691004,7941013,7943041,9201005,9201004,9810011,9941013,9942051,9943041,10152030,10152031,10230001,44300047,44300062,44300063,45000005,45000008,45000025,45000120,47300400,47500300,47600400,47600500,47600600,47610300,47610400,47611500,47621300,47650600,47661900,47671000,47690000,49400700,49400710,60950512,60950513,73502005,73504000,74300047,90340107,91600001,91600003,91600029,93502005,93504000,93900004,93910011,93910012,93920014,93920018,93930010,93930012,97502500,97502600,97502700,98850038,98850039,99002400,99002410,99002420,99002430,99002440,99002450,99002460,99002470,983300001,10153020,201802,950700002,32010005,32010223,32010225,30260257,30271012,32010205,32010110,32021012,31031008,31031012,32031008,32031012,30411042,30411001,303404000,303401008,"; //up to date as of VM9 patch
	//not 30260021, 30260022
	let whitelist = ",280150 4,210300 9,193300 2,180100 8,";
	//whitelist: stoneskin-off(268715606), gunner-recall(268645756), slayer tenacity, reaper escape
	//whitelist is used for cancellable self CC skills

	let forceclip = ",20100 0,40200 2,40230 2,290100 3,240200 3,400100 8,400130 8,400101 9,400102 9,400131 9,400132 9,400100 10,400130 10,20100 11,20130 11,140100 12,140101 12,";

	let forceclipback = ",260100 1,150800 2,70100 4,180600 4,60100 5,160600 5,261000 6,380100 6,50900 11,50930 11,";

	let advccwhitelist = ",200100,201400,201401,201802,10151033," //leashes, soul reversal


	let bs1 =300201;
	let bs11 =300200;
	let bs2 =10155400;
	let bs1t = false;
	let bs2t = false;
	//,300201,33200,
	let snareID = ",7692002,9692002,";
	let snareID2 = ",501303,501321,501323,400801,400800,"; //gyre

	let snareBlacklist = ",20100 1,251000 1,260100 1,151000 1,";

	let snareBlacklist2 = ",90100 11,20100 11,61100 11,50900 11,140100 12,20100 0,100700 0,400100 8,180100 8,90100 8,260100 1,261000 6,380100 6,400100 10,60100 5,330100 5,40200 2,50300 2,170300 2,150800 2,400100 9,110800 9,290100 3,240200 3,50200 3,170100 7,70100 4,260100 4,";
	//should be everything

	let knockupIDs = ",10152030,10152031,801920,801901,"; //priest/gunner/lancer (201800) - sorc is in eachskillresult
	let knockupIDs2 =10153509;

	let snare1lock = false;
	let snare2lock = false;

	let knockuplock = false;
	let knockuplock2 = false;

	let speedlol;
	let speedbase;
	let speednormal;
	let zmrx;
	let zmry;
	
	let enabled = true;
	let checker = true;

	let setEndx = false;
	let setEndy;
	let setEndSkill;
	let setEndDist =0;
	
	let pvplock = false;
	
	const BLACKLIST = [110100, 111110, 111111, 111112, 111113, 111114, 111115, 111116, 111117, 111118, 111119, 111120, 111121, 111122, 111124, 111125,
    111126, 111127, 111128, 111129, 111130, 111131, 111134, 111135, 111139, 111140, 111143, 111144, 111145, 111190, 111191, 111193,
    111194, 111195, 111197, 111199, 111202, 111203, 116001, 116002, 116003, 116004, 117002, 117003, 460100, 480100, 900001,
    111136, 111137, 111138, 111141, 111142, 111147, 111149, 111150, 111151, 111152, 111153, 111154, 111155, 111156, 111157, 111158,
    211141, 211150, 111123, 111132, 111133, 111146, 111148, 111192, 111196, 111198, 211145, 111159, 111160, 111161, 111162, 111163,
    111164, 111165, 111166, 111168, 111169, 111170, 111171, 111172, 111173, 111174, 111175, 111176, 111177, 111178, 111179, 111180,
    111204, 111205, 111206, 111207, 111208, 111209, 111210, 111211, 111212, 111214, 111215, 111216, 111217, 111218, 111219, 111220,
    111221, 111222, 111223, 111224, 111225, 111226, 111227, 111228, 111229, 111230, 111231, 111232, 111233, 111234, 111235, 111236,
    111237, 111238, 111239, 111241, 111242, 111243, 111244, 111245, 111246, 111247, 111248, 111249, 111250, 111251, 111252, 111253,
    111254, 111255, 111256, 111257, 111258, 111259, 111260, 111261, 111262, 111263, 111264, 111265, 111266, 111267, 111268, 111269,
    111270, 111271, 111272, 111273, 111274, 111275, 111276, 111277, 111278, 111279, 111280, 111281, 111282, 111283, 111284, 111285,
    111286, 111287, 111288, 111289, 111290, 111291, 111292, 111293, 111294, 111295, 111296, 111297, 111298, 111299, 111301, 111302, 111310, 111320, 111319, 111324, 111325, 111330, 111305, 111326, 111328, 111314, 111308, 111307, 111327, 111311, 111309, 111329,111321,111317,
	111304, 111316];
	

	dispatch.hook('S_LOGIN', dispatch.majorPatchVersion >= 86 ? 14 : 13, (event) => {
		cid = event.gameId;
		model = event.templateId;
		name = event.name;
		job = (model -10101) %100;
		var vvv =0;
		skillLock = false;
		hardCC = false;
		snare1lock = false;
		snare2lock = false;
		fullLock = false;
		cctoggle2 = true;
		stageLock = false;
		knockuplock = false;
		knockuplock2 = false;
		setEndSkill =0;
		setEndx = false;
		setEndy = false;
	});
	
	dispatch.hook('C_CHAT', 1, { order: -10 }, (event) => {
		if (event.message.includes("disable99")) {
			enabled = false;
			checker = false;
			console.log("ZSync script disabled");
			return false;
		}
		if (event.message.includes("enable99")) {
			enabled = true;
			checker = true;
			console.log("ZSync script enabled");
			return false;
		}
	});
	
	dispatch.hook('S_LOAD_TOPO', 3, (event) => {
		/*if (event.zone >= 110 && event.zone <=118) {
			//pvplock = true;
		}
		else {
			pvplock = false;
		}*/
		if (event.zone == 3206 || event.zone == 3106 || event.zone == 3203 || event.zone ==3103) { //killing g / FA
			enabled = false;
		}
		else if(checker){
			enabled = true;
		}
	});

	dispatch.hook('S_SPAWN_ME', 3, (event) => {
		skillLock = false;
		hardCC = false;
		snare1lock = false;
		snare2lock = false;
		fullLock = false;
		cctoggle2 = true;
		stageLock = false;
		knockuplock = false;
		knockuplock2 = false;
		setEndSkill =0;
		setEndx = false;
		setEndy = false;
	});

	dispatch.hook('C_REVIVE_NOW', 2, (event) => {
		skillLock = false;
		hardCC = false;
		snare1lock = false;
		snare2lock = false;
		fullLock = false;
		cctoggle2 = true;
		stageLock = false;
		knockuplock = false;
		knockuplock2 = false;
		setEndSkill =0;
		setEndx = false;
		setEndy = false;
	});

	dispatch.hook('C_CHAT', 1, (event) => {
		if (event.message.includes("advancedcc1")) {
			cctoggle = !cctoggle;
			console.log("ADVANCED_CC is " + cctoggle);
			return false;
		}
		if (event.message.includes("unstuck1")) {
			skillLock = false;
			hardCC = false;
			snare1lock = false;
			snare2lock = false;
			fullLock = false;
			cctoggle2 = true;
			stageLock = false;
			knockuplock = false;
			knockuplock2 = false;
			setEndSkill =0;
			setEndx = false;
			setEndy = false;
			console.log("Manual unstuck complete.");
			return false;
		}
	});

	dispatch.hook('S_ABNORMALITY_BEGIN', 5, (event) => {
		if(!enabled) {return;}
		var tempStr = "," + event.id.toString() + ",";
		if (event.target === cid) {
			lastAbnormality = event;
			if (silenceID.includes(tempStr)) {
				skillLock = true;
				fullLock = true;
			}
			if (advccwhitelist.includes(tempStr)) {
				if (cctoggle) {
					cctoggle2 = false;
					checkpointx = checkpointx +1;
				}
			}
			if (snareID.includes(tempStr)) {
				snare1lock = true;
			}
			if (snareID2.includes(tempStr)) {
				snare2lock = true;
			}
			if (knockupIDs.includes(tempStr)) {
				knockuplock = true;
			}
			if (event.id == knockupIDs2) {
				knockuplock2 = true;
			}
			if (event.id == bs1 || event.id == bs11) {
				bs1t = true;
			}
			if (event.id == bs2) {
				bs2t = true;
			}
		}
	});

	/*dispatch.hook('S_AIR_REACTION_END', 1, (event) => {\
	if(!enabled) {return;}
		if(event.gameId === cid){
			skillLock = false;
			hardCC = false;
		}
	});*/

	dispatch.hook('S_ABNORMALITY_END', 1, (event) => {
		if(!enabled) {return;}
		var tempStr = "," + event.id.toString() + ",";
		if (event.target === cid) {
			if (silenceID.includes(tempStr)) {
				skillLock = false;
				fullLock = false;
			}
			if (advccwhitelist.includes(tempStr)) {
				if (checkpointx >0) {
					checkpointx = checkpointx -1;
				}
				if (checkpointx ==0) {
					cctoggle2 = true;
				}
			}
			if (snareID.includes(tempStr)) {
				snare1lock = false;
			}
			if (snareID2.includes(tempStr)) {
				snare2lock = false;
			}
			if (knockupIDs.includes(tempStr)) {
				knockuplock = false;
			}
			if (event.id == knockupIDs2) {
				knockuplock2 = false;
				skillLock = false;
				hardCC = false;
			}
			if (event.id == bs1 || event.id == bs11) {
				bs1t = false;
			}
			if (event.id == bs2) {
				bs2t = false;
			}
		}
	});

	dispatch.hook('S_EACH_SKILL_RESULT', dispatch.majorPatchVersion >= 86 ? 14 : 13, (event) => {
		if(!enabled) {return;}
		if (event.target === cid) {
			lastStage = event.reaction.skill.id;
			//clearTimeout(staggerlock2);
			//staggerlock = false;
			if (event.reaction.enable == true) {
				if(!(event.reaction.air == true /*&& (event.reaction.skill.id == 1100201 || event.reaction.skill.id ==1090501)*/)){
				skillLock = true;
				hardCC = true;
				}
			}
			let varx =0;
			try { varx = event.reaction.animSeq[0].duration; }
			catch (e) { }
			//console.log(varx + " " + skillLock + " " + event.setTargetAction);
			if (event.reaction.enable == true && (varx == 850 || varx == 833 || varx ==900)) {
				clearTimeout(staggerlock2);
				staggerlock = true;
				staggerlock2 = setTimeout(function () {
					staggerlock = false;
				}, varx - MY_PING);
			}
			if (event.reaction.enable == true && cctoggle && (varx == 850 || varx == 833 || varx ==900)) {
				abnormalityCounter++;
				if (event.reaction.skill.id == killNext) {
					killNext =0;
				}
				if (lastSkill != lastStage && lastSkill !=0) {
					dispatch.toClient('S_INSTANT_MOVE', 3, {
						gameId: cid,
						loc: event.reaction.loc,
						w: event.reaction.w,
					});
					lastSkill =0;
				}
				setTimeout(function (roflc, rofld) {
					if (rofld == abnormalityCounter) {
						roflc.reaction.skill.type =2;
						dispatch.toClient('S_ACTION_END', 5, {
							gameId: cid,
							loc: roflc.reaction.loc,
							w: roflc.reaction.w,
							templateId: model,
							skill: roflc.reaction.skill,
							type: 0,
							id: roflc.reaction.id,
						});
						killNext = roflc.reaction.skill.id;
					}
					if (rofld == abnormalityCounter) {
						skillLock = false;
						hardCC = false;
					}
				}, (varx - MY_PING), event, abnormalityCounter);
			}
		}
	});

	dispatch.hook('S_ACTION_STAGE', 9, { order: -99999 }, (event) => {
	  //console.log("test: " + event.skill == 67119608);
		if(!enabled) {return;}
		if (event.gameId === cid) {
			lastStage = event.skill.id;
			var xzzy = event.skill.id;
			var cccheck = "," + xzzy.toString() + ",";
			if (cctoggle && cctoggle2 && !advccwhitelist.includes(cccheck)) {
				let check1 =0;
				try { check1 = event.animSeq[0].distance; }
				catch (e) { }
				let check2 =0;
				try { check2 = event.animSeq[0].duration; }
				catch (e) { }
				if (check1 == -1 && check2 ==88888888) {
					abnormalityCounter++;
					if (event.skill.id == killNext) {
						killNext =0;
					}
					if (lastSkill != lastStage && lastSkill !=0) {
						dispatch.toClient('S_INSTANT_MOVE', 3, {
							gameId: cid,
							loc: {
								x: event.loc.x,
								y: event.loc.y,
								z: event.loc.z
							},
							w: event.w,
						});
						lastSkill =0;
					}
					setTimeout(function (rofl, roflz) {
						if (roflz == abnormalityCounter) {
							dispatch.toClient('S_ABNORMALITY_END', 1, {
								target: cid,
								id: rofl.id,
							});
						}
					}, (Number(lastAbnormality.duration) - MY_PING), lastAbnormality, abnormalityCounter);
					setTimeout(function (rofla, roflb) {
						if (roflb == abnormalityCounter) {
							if (rofla.skill.id !=1100904)
								rofla.skill.type =2;
							dispatch.toClient('S_ACTION_END', 5, {
								gameId: cid,
								loc: {
									x: rofla.loc.x,
									y: rofla.loc.y,
									z: rofla.loc.z
								},
								w: rofla.w,
								templateId: rofla.model,
								skill: rofla.skill,
								type: 0,
								id: rofla.id,
							});
							killNext = rofla.skill.id;
						}
						if (roflb == abnormalityCounter) {
							skillLock = false;
							hardCC = false;
						}
					}, (Number(lastAbnormality.duration) - MY_PING), event, abnormalityCounter);
				}
			}
			var xzzy = event.skill.id;
			var tempStr = "," + xzzy + " " + job.toString() + ",";
			if ((forceclip.includes(tempStr)/* || (!DISABLE_SNARE_FIX && bscheck && !forceclipback.includes(tempStr))*/) && event.animSeq.length && FORCE_CLIP_WALL) {
				skillLock = true;
				let distance =0;
				for (let m of event.animSeq) distance += m.distance;
				distance = distance -25;
				var newX;
				var newY;
				var angle = parseFloat(event.w);

				newX = Math.cos(angle) * distance;
				newY = Math.sin(angle) * distance;

				xloz = event.loc.x + newX;
				yloz = event.loc.y + newY;
				zloz = event.loc.z +2;
				wloz = event.w;
			}
			if (forceclipback.includes(tempStr) && event.animSeq.length && FORCE_CLIP_WALL) {
				skillLock = true;
				let distance =0;
				for (let m of event.animSeq) distance += m.distance;
				distance = distance -25;
				distance = -distance;
				var newX;
				var newY;
				var angle = parseFloat(event.w);

				newX = Math.cos(angle) * distance;
				newY = Math.sin(angle) * distance;

				xloz = event.loc.x + newX;
				yloz = event.loc.y + newY;
				zloz = event.loc.z +2;
				wloz = event.w;
			}
			var xzzy = event.skill.type ===1;
			if (!xzzy) {
				if ((job !== 8 || event.skill.id !==999) && event.skill.id !=1100902) {
					skillLock = true;
					hardCC = true;
					stageLock = true;
				}
			}
			var bscheck;
			if (bs1t || bs2t) {
				bscheck = true;
			}
			if (!bs1t && !bs2t) {
				bscheck = false;
			}
			if (bscheck && lastInput !=1) {
				zmrx = event.stage +1;
				snarelist[((event.skill.id) * zmrx * (job +1))] = event.animSeq;
				if (job == 12 && !snarelist[((event.skill.id +30) * (job +1))]) {
					snarelist[(((event.skill.id -30)) * zmrx * (job +1))] = event.animSeq;
				}
				if (job == 12 && !snarelist[((event.skill.id -30) * (job +1))]) {
					snarelist[(((event.skill.id +30)) * zmrx * (job +1))] = event.animSeq;
				}
				settingUpdate();
			}
			if (speedlol < 0 && (speedlol + speedbase) != 0 && !bscheck && lastInput !=1) {
				try {
					zmrx = event.stage +1;
					zmry = event.animSeq;
					for (var i = 0, length = zmry.length; i < length; i++) {
						zmry[i].distance = zmry[i].distance / ((speedlol + speedbase) / speednormal);
					}
					slowtable[((event.skill.id) * zmrx * (job +1))] = zmry;
					if (job == 12 && !slowtable[(((event.skill.id -30)) * zmrx * (job +1))]) {
						slowtable[(((event.skill.id -30)) * zmrx * (job +1))] = zmry;
					}
					if (job == 12 && !slowtable[(((event.skill.id +30)) * zmrx * (job +1))]) {
						slowtable[(((event.skill.id +30)) * zmrx * (job +1))] = zmry;
					}
					settingUpdate();
				}
				catch (e) { }
			}
		}
	});
	dispatch.hook('S_ACTION_END', 5, { order: -99999 }, (event) => {
	  if(event.skill == 67108232) console.log("error");
		if(!enabled) {return;}
		if (event.gameId === cid) {
			//setTimeout(function(event){if(endOrder != event && hardCC){dispatch.toClient('S_ACTION_END', 5, event);}}, 30, event);
			var xzzy = event.skill.type ===1;
			if (!xzzy) {
				if (FORCE_SYNC_ALWAYS) {
					dispatch.toClient('S_INSTANT_MOVE', 3, {
						gameId: cid,
						loc: event.loc,
						w: event.w,
					});
				}
				skillLock = false;
				hardCC = false;
				stageLock = false;
				if (releaseQueue) {
					queueSkill.x = event.loc.x;
					queueSkill.y = event.loc.y;
					queueSkill.z = event.loc.z;
					queueSkill.w = event.w;
					dispatch.toClient('S_ACTION_END', 5, queueSkill);
				}
				releaseQueue = false;
			}
		}
	});

	dispatch.hook('S_ACTION_END', 5, { order: 99999 }, (event) => {
	  if(event.skill == 67108232) console.log("error");
		if(!enabled) {return;}
		if (event.gameId === cid) {
			endOrder = event;
			if (xloz != false) {
				xloz = false;
				skillLock = false;
			}
			if (event.skill.id == killNext) {
				killNext =0;
				return false;
			}
		}
	});

	dispatch.hook('S_ACTION_END', 5, { order: 99999, filter: { fake: true } }, (event) => {
	  if(event.skill == 67108232) console.log("error");
		if(!enabled) {return;}
		if (xloz != false) {
			if (FORCE_CLIP_WALL) {
				event.loc.x = xloz;
				event.loc.y = yloz;
				event.loc.z = zloz;
				dispatch.toClient('S_INSTANT_MOVE', 3, {
					gameId: cid,
					loc: event.loc,
					w: event.w,
				});
				skillLock = false;
			}
		}
		xloz = false;
		yloz = false;
		zloz = false;
		if (skillLock == true && hardCC) {
			queueSkill = event;
			//releaseQueue = true;
			//return false;
		}
		if (setEndx && event.skill.id == setEndSkill) {
			event.loc.x = setEndx;
			event.loc.y = setEndy;
			setEndSkill =0;
		}
		return true;
	});

	dispatch.hook('S_ACTION_STAGE', 9, { order: 99999, filter: { fake: true } }, (event) => {
	  //console.log("test: " + event.skill == 67119608);
		if(!enabled) {return;}
		var bscheck;
		if (bs1t || bs2t) {
			bscheck = true;
		}
		if (!bs1t && !bs2t) {
			bscheck = false;
		}
		if (bscheck && lastInput != 1 && !DISABLE_SNARE_FIX) {
			zmrx = event.stage +1;
			try {
				event.animSeq = snarelist[((event.skill.id) * zmrx * (job +1))];
				if (event.skill.id != setEndSkill) {
					setEndDist =0;
				}
				for (let m of event.animSeq) setEndDist += m.distance;
				setEndDist = setEndDist -25;
				var angle = parseFloat(event.w);

				setEndx = Math.cos(angle) * setEndDist + event.x;
				setEndy = Math.sin(angle) * setEndDist + event.y;
				setEndSkill = event.skill.id;
			}
			catch (e) { }
		}

		var counterxyz = true;
		if (lastStage == 101100 && lastSkill == 240200 && job ==3) { //fix for stupid cyclone -> es
			counterxyz = false;
		}

		if (lastStage == 280100 && (lastSkill == 40200 || lastSkill ==40230) && job ==2) { //fix for stupid bigsword -> roll
			counterxyz = false;
		}

		if ((lastSkill == 20100 || lastSkill == 20130 || lastSkill == 50900 || lastSkill == 50930 || lastSkill ==61101) && job ==11) { //whitelist ninja roll, bomb and 1k
			counterxyz = false;
		}

		if ((lastSkill == 400100 || lastSkill ==400130) && job ==10) { //whitelist brawler roll
			counterxyz = false;
		}

		if ((lastSkill ==400100) && job ==8) { //whitelist reaper roll
			counterxyz = false;
		}
		
		if ((lastSkill == 20200 || lastSkill == 20230 || lastSkill ==20240) && job ==1) { //whitelist lancer block
			counterxyz = false;
		}

		if (speedlol < 0 && (speedlol + speedbase) != 0 && !bscheck && lastInput != 1 && !DISABLE_SLOW_FIX && counterxyz) {
			zmrx = event.stage +1;
			try {
				zmry = slowtable[((event.skill.id) * zmrx * (job +1))];
				for (var i = 0, length = zmry.length; i < length; i++) {
					zmry[i].distance = zmry[i].distance * ((speedlol + speedbase) / speednormal);
				}
				event.animSeq = zmry;

				if (event.skill.id != setEndSkill) {
					setEndDist =0;
				}
				for (let m of event.animSeq) setEndDist += m.distance;
				setEndDist = setEndDist -25;
				var angle = parseFloat(event.w);

				var xzzy = event.skill.id;
				var tempStr = "," + xzzy + " " + job.toString() + ",";
				if (forceclipback.includes(tempStr)) {
					setEndDist = -setEndDist;
				}

				setEndx = Math.cos(angle) * setEndDist + event.loc.x;
				setEndy = Math.sin(angle) * setEndDist + event.loc.y;
				setEndSkill = event.skill.id;
			}
			catch (e) { }
		}

		//console.log(setEndDist);

		if (xloz != false) {
			if (FORCE_CLIP_WALL) {
				event.loc.x = xloz;
				event.loc.y = yloz;
				event.loc.z = zloz +2;
				dispatch.toClient('S_INSTANT_MOVE', 3, {
					gameId: cid,
					loc: event.loc,
					w: event.w,
				});
				skillLock = false;
				//event.animSeq = [{duration: 50000, xyRate: 1, zRate: 1, distance: 0}];
			}
		}
		xloz = false;
		yloz = false;
		zloz = false;
		var xzzy = event.skill.type ===1;
		if (skillLock == true && hardCC && (event.skill.id == 140300 && job ==8) == false && xzzy == false) {
			return false;
		}
		return true;
	});

	dispatch.hook('C_START_SKILL', 7, { order: -99999 }, (event) => {
		if(!enabled) {return;}
		lastInput =0;
		lastSkill = event.skill.id;
		var xzzy = event.skill.id;
		var tempStr = "," + xzzy.toString() + " " + job.toString() + ",";
		
		if(!(BLACKLIST.indexOf(event.skill.id) === -1)){
			dispatch.toServer('C_START_SKILL', 7, event);
			return false;
		}
		
		
		if (whitelist.includes(tempStr)) {
			return;
		}
		if((PVP_BLOCK[job.toString()].indexOf(event.skill.id) !== -1) && pvplock){
			return false;
		}
		if (fullLock == true) {
			dispatch.toClient('S_CANNOT_START_SKILL', 4, {
				skill: event.skill,
			});
			return false;
		}
		if (!cctoggle2) {
			return false;
		}

		var retal = S_RETAL[job.toString()].indexOf(event.skill.id) !== -1;
		if (((!staggerlock && !stageLock) || knockuplock2) && retal) {
			return;
		}
		if ((staggerlock || stageLock) && retal) {
			return false;
		}
		var tempStr2 = "," + xzzy + " " + job.toString() + ",";
		if (snareBlacklist.includes(tempStr2) && snare1lock && !DISABLE_SNARE_FIX) {
			return false;
		}
		if (snareBlacklist2.includes(tempStr2) && snare2lock && !DISABLE_SNARE_FIX) {
			return false;
		}
		if (!(snareBlacklist2.includes(tempStr2)) && knockuplock) {
			return false;
		}

		if (skillLock == true) {
			return false;
		}
	});
	dispatch.hook('C_START_TARGETED_SKILL', 7, { order: -99999 }, (event) => {
		if(!enabled) {return;}
		lastInput =1;
		lastSkill = event.skill.id;
		if((PVP_BLOCK[job.toString()].indexOf(event.skill.id) !== -1) && pvplock){
			return false;
		}
		if (fullLock == true) {
			dispatch.toClient('S_CANNOT_START_SKILL', 4, {
				skill: event.skill,
			});
			return false;
		}
		if (!cctoggle2) {
			return false;
		}
		var xzzy = event.skill.id;
		var tempStr = "," + xzzy.toString() + " " + job.toString() + ",";
		var tempStr2 = "," + xzzy + " " + job.toString() + ",";
		if (snareBlacklist.includes(tempStr2) && snare1lock && !DISABLE_SNARE_FIX) {
			return false;
		}
		if (snareBlacklist2.includes(tempStr2) && snare2lock && !DISABLE_SNARE_FIX) {
			return false;
		}
		if (!(snareBlacklist2.includes(tempStr2)) && knockuplock) {
			return false;
		}
		if (whitelist.includes(tempStr)) {
			return;
		}
		if (skillLock == true) {
			return false;
		}
	});
	dispatch.hook('C_START_COMBO_INSTANT_SKILL', 6, { order: -99999 }, (event) => {
		if(!enabled) {return;}
		lastInput =0;
		lastSkill = event.skill.id;
		if((PVP_BLOCK[job.toString()].indexOf(event.skill.id) !== -1) && pvplock){
			return false;
		}
		if (fullLock == true) {
			dispatch.toClient('S_CANNOT_START_SKILL', 4, {
				skill: event.skill,
			});
			return false;
		}
		if (!cctoggle2) {
			return false;
		}
		var xzzy = event.skill.id;
		var tempStr = "," + xzzy.toString() + " " + job.toString() + ",";
		var tempStr2 = "," + xzzy + " " + job.toString() + ",";
		if (snareBlacklist.includes(tempStr2) && snare1lock && !DISABLE_SNARE_FIX) {
			return false;
		}
		if (snareBlacklist2.includes(tempStr2) && snare2lock && !DISABLE_SNARE_FIX) {
			return false;
		}
		if (!(snareBlacklist2.includes(tempStr2)) && knockuplock) {
			return false;
		}
		if (whitelist.includes(tempStr)) {
			return;
		}
		if (skillLock == true) {
			return false;
		}
	});
	dispatch.hook('C_START_INSTANCE_SKILL', 7, { order: -99999 }, (event) => {
		if(!enabled) {return;}
		lastInput =0;
		lastSkill = event.skill.id;
		if((PVP_BLOCK[job.toString()].indexOf(event.skill.id) !== -1) && pvplock){
			return false;
		}
		if (fullLock == true) {
			dispatch.toClient('S_CANNOT_START_SKILL', 4, {
				skill: event.skill,
			});
			return false;
		}
		if (!cctoggle2) {
			return false;
		}
		var xzzy = event.skill.id;
		var tempStr = "," + xzzy.toString() + " " + job.toString() + ",";
		var tempStr2 = "," + xzzy + " " + job.toString() + ",";
		if (snareBlacklist.includes(tempStr2) && snare1lock && !DISABLE_SNARE_FIX) {
			return false;
		}
		if (snareBlacklist2.includes(tempStr2) && snare2lock && !DISABLE_SNARE_FIX) {
			return false;
		}
		if (!(snareBlacklist2.includes(tempStr2)) && knockuplock) {
			return false;
		}
		if (whitelist.includes(tempStr)) {
			return;
		}
		if (skillLock == true) {
			return false;
		}
	});
	dispatch.hook('C_START_INSTANCE_SKILL_EX', 5, { order: -99999 }, (event) => {
		if(!enabled) {return;}
		lastInput =0;
		lastSkill = event.skill.id;
		if((PVP_BLOCK[job.toString()].indexOf(event.skill.id) !== -1) && pvplock){
			return false;
		}
		if (fullLock == true) {
			dispatch.toClient('S_CANNOT_START_SKILL', 4, {
				skill: event.skill,
			});
			return false;
		}
		if (!cctoggle2) {
			return false;
		}
		var xzzy = event.skill.id;
		var tempStr = "," + xzzy.toString() + " " + job.toString() + ",";
		var tempStr2 = "," + xzzy + " " + job.toString() + ",";
		if (snareBlacklist.includes(tempStr2) && snare1lock && !DISABLE_SNARE_FIX) {
			return false;
		}
		if (snareBlacklist2.includes(tempStr2) && snare2lock && !DISABLE_SNARE_FIX) {
			return false;
		}
		if (!(snareBlacklist2.includes(tempStr2)) && knockuplock) {
			return false;
		}
		if (whitelist.includes(tempStr)) {
			return;
		}
		if (skillLock == true) {
			return false;
		}
	});
	dispatch.hook('C_PRESS_SKILL', 4, { order: -99999 }, (event) => {
		if(!enabled) {return;}
		lastInput =0;
		lastSkill = event.skill.id;
		if((PVP_BLOCK[job.toString()].indexOf(event.skill.id) !== -1) && pvplock){
			return false;
		}
		if (fullLock == true) {
			if(event.press != false){
			dispatch.toClient('S_CANNOT_START_SKILL', 4, {
				skill: event.skill,
			});
			}
			return false;
		}
		if (!cctoggle2) {
			return false;
		}
		var xzzy = event.skill.id;
		var tempStr = "," + xzzy.toString() + " " + job.toString() + ",";
		var tempStr2 = "," + xzzy + " " + job.toString() + ",";
		if (snareBlacklist.includes(tempStr2) && snare1lock && !DISABLE_SNARE_FIX) {
			return false;
		}
		if (snareBlacklist2.includes(tempStr2) && snare2lock && !DISABLE_SNARE_FIX) {
			return false;
		}
		if (!(snareBlacklist2.includes(tempStr2)) && knockuplock) {
			return false;
		}
		if (whitelist.includes(tempStr)) {
			return;
		}
		if (skillLock == true && event.press != false) {
			return false;
		}
	});
	dispatch.hook('C_NOTIMELINE_SKILL', 3, { order: -99999 }, (event) => {
		if(!enabled) {return;}
		lastInput =0;
		lastSkill = event.skill.id;
		if((PVP_BLOCK[job.toString()].indexOf(event.skill.id) !== -1) && pvplock){
			return false;
		}
		if (fullLock == true) {
			dispatch.toClient('S_CANNOT_START_SKILL', 4, {
				skill: event.skill,
			});
			return false;
		}
		if (!cctoggle2) {
			return false;
		}
		var xzzy = event.skill.id;
		var tempStr = "," + xzzy.toString() + " " + job.toString() + ",";
		var tempStr2 = "," + xzzy + " " + job.toString() + ",";
		if (snareBlacklist.includes(tempStr2) && snare1lock && !DISABLE_SNARE_FIX) {
			return false;
		}
		if (snareBlacklist2.includes(tempStr2) && snare2lock && !DISABLE_SNARE_FIX) {
			return false;
		}
		if (!(snareBlacklist2.includes(tempStr2)) && knockuplock) {
			return false;
		}
		if (whitelist.includes(tempStr)) {
			return;
		}
		if (skillLock == true) {
			return false;
		}
	});

	dispatch.hook('S_PLAYER_STAT_UPDATE', dispatch.majorPatchVersion >= 106 ? 16 : 15, (event) => {
		speedlol = event.runSpeedBonus;
		speedbase = event.runSpeed;
		if (speedlol > (-1)) {
			speednormal = speedlol + speedbase;
		}
		if (event.hp ==0) {
			skillLock = false;
			hardCC = false;
			snare1lock = false;
			snare2lock = false;
			fullLock = false;
			cctoggle2 = true;
			stageLock = false;
			knockuplock = false;
			knockuplock2 = false;
			setEndSkill =0;
			setEndx = false;
			setEndy = false;
		}
	});
}
