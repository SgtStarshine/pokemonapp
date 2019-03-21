

var wobblemsg = ["miss altogether", "wobble once", "wobble twice", "wobble three times"];
//num_wobbles[0] = "Miss";
msg = ["The ball missed the POKéMON!", "Darn! The POKéMON broke free!", "Aww! It appeared to be caught!", "Shoot! It was so close too!"];
var status_mods = {
    none: 0,
    psn: 5,
    par: 5,
    brn: 5,
    slp: 10,
    frz: 10
};
var max_iv = 15;
var version_group = 2;
function get_hp_bar_class(hp) {
    var hpfill = (hp === -1 ? 1 : hp / 100 * 48);
    if (hpfill < 10) {
        return "low_hp";
    }
    if (hpfill < 27) {
        return "medium_hp";
    }
    return "high_hp";
}
function get_version_group() {
    if ($("#game-y").is(":checked")) {
        return 2;
    } else {
        return 1;
    }
}
function get_ball_bonus(ball) {
    switch (ball) {
        case 'poke-ball':
            return 256;
        case 'great-ball':
            return 201;
        case 'ultra-ball':
        case 'safari-ball':
            return 151;
        case 'master-ball':
            return -1;
        default:
            return 256;
    }
}
// In R/B/Y, this function is used to calculate the HP factor
function calc_x(m, hp, c, b, s, gr, e) {
    // G value, the Great Ball modifier
    var g = 12;
    if (b == 201) {
        g = 8;
    }
    return Math.min(255, Math.floor(Math.floor(m * 255 / g) / Math.max(1, Math.floor(hp / 4))));
}
function calc_chances(f, c, b, sw, p) {
    // S value, the status factor for the true formula
    var s = Math.floor(sw * 2.5);
    var chance_obj = new ChanceObj();
    var num_f = f.length;
    var approx = "";
    for (var i = 0; i < num_f; i++) {
        var chance = (s + Math.min(c + 1, b - s) * (f[i] + 1) / 256) / b;
        var wobblechance = Math.floor((Math.floor((c * 100) / (b - 1)) * f[i]) / 255) + sw;
        var wobbles = 0;
        if (wobblechance >= 10) {
            wobbles++;
        }
        if (wobblechance >= 30) {
            wobbles++;
        }
        if (wobblechance >= 70) {
            wobbles++;
        }
        if (Math.abs(chance - wobblechance) < 1 || Math.abs(1 - (chance * 100) / wobblechance) < 0.2 || chance == 1 && wobblechance >= 100) {
            approx = ", with reasonable accuracy,";
        } else {
            approx = ", rather poorly,";
        }
        chance_obj.success += chance / num_f;
        chance_obj['wobble' + wobbles] += (1 - chance) / num_f;
        chance_obj.comp_val = f[i];
    }
    if (num_f == 1) {
        chance_obj.extra_msg = " The game estimates your chances" + approx + " to be around " + wobblechance + "%. If the capture fails" + (chance == 1 ? " (not that it will, since it's 100% and all)" : "") + ", the ball will therefore " + wobblemsg[wobbles] + ".";
    }
    return chance_obj;
}
var num_wobbles = ["No wobbles", "One wobble", "Two wobbles", "Three wobbles"];
var msg = ["", "", "", ""];
var status_mods;
var max_iv = 31;
var version_group = 17;
var $results;
function show_percent(chance) {
    // Print a nice percentage value for the given chance out of 1.
    return Math.round(chance * 100000) / 1000;
}
function ChanceObj() {
    this.success = 0;
    this.wobble3 = 0;
    this.wobble2 = 0;
    this.wobble1 = 0;
    this.wobble0 = 0;
    this.critical = 0;
    this.crit_success = 0;
    this.freeze = false;
    this.extra_msg = "";
    this.comp_val = 0;
}
function get_version_group() {
    return version_group;
}
function copy_object(obj) {
    var new_obj = {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            new_obj[key] = obj[key];
        }
    }
    return new_obj;
}
function get_pokemon(pokemon, form) {
    // Get Pokémon data, with version-dependent stat modifications.
    var mon = copy_object(w[pokemon][form || 0]);
    var version_group = get_version_group();
    if (version_group < 18) {
        // Unapply US/UM stat changes
        switch (pokemon) {
            case 794: // Buzzwole
                mon.catch_rate = 25;
                break;
            case 795: // Pheromosa
                mon.catch_rate = 255;
                break;
            case 796: // Xurkitree
                mon.catch_rate = 30;
                break;
            case 797: // Celesteela
                mon.catch_rate = 25;
                break;
            case 798: // Kartana
                mon.catch_rate = 255;
                break;
            case 799: // Guzzlord
                mon.catch_rate = 15;
                break;
            case 800: // Necrozma
                mon.catch_rate = 3;
                break;
        }
    }
    if (version_group < 17) {
        // Unapply Sun/Moon stat changes
        switch (pokemon) {
            case 85: // Dodrio
                mon.speed = 100;
                break;
            case 101: // Electrode
                mon.speed = 140;
                break;
            case 219: // Magcargo
                mon.hp = 50;
                break;
            case 222: // Corsola
                mon.hp = 55;
                break;
            case 226: // Mantine
                mon.hp = 65;
                break;
            case 284: // Masquerain
                mon.speed = 60;
                break;
            case 301: // Delcatty
                mon.speed = 70;
                break;
            case 337: // Lunatone
            case 338: // Solrock
                mon.hp = 70;
                break;
            case 358: // Chimecho
                mon.hp = 65;
                break;
            case 527: // Woobat
                mon.hp = 55;
                break;
        }
    }
    if (version_group < 16) {
        // Unapply OR/AS catch rate changes
        switch (pokemon) {
            case 382:
            case 383:
                // Groudon, Kyogre
                mon.catch_rate = 5;
                break;
            case 483:
            case 484:
                // Dialga, Palkia
                mon.catch_rate = 30;
                break;
            case 643:
            case 644:
                // Reshiram, Zekrom
                mon.catch_rate = 45;
                break;
            case 384:
                // Rayquaza
                mon.catch_rate = 3;
                break;
        }
    }
    if (version_group < 15) {
        // Unapply X/Y stat changes
        switch (pokemon) {
            case 18: // Pidgeot
                mon.speed = 91;
                break;
            case 26: // Raichu
                mon.speed = 100;
                break;
        }
    }
    if (version_group < 11 && pokemon === 479) {
        // Rotom forms are all Electric/Ghost prior to gen 5.
        // We don't have to bother fiddling with the types of every other Pokémon whose types have changed, since the only ones that matter for capture calculations are Bug and Water (because of the Net Ball) and the only other type changes that have happened didn't touch either of those types.
        mon.types = ["electric", "ghost"];
    }
    if (version_group < 5 && pokemon === 20) {
        // Raticate's catch rate changed in R/S/E
        mon.catch_rate = 90;
    }
    if (version_group === 2) {
        // Dragonair and Dragonite's catch rates changed in Yellow
        if (pokemon === 148) {
            mon.catch_rate = 27;
        } else if (pokemon === 149) {
            mon.catch_rate = 9;
        }
    }
    return mon;
}
function get_hp() {
    // -1 as a return value from this function stands for False Swiped to 1 HP.
    if ($("#hp1").is(":checked")) {
        // False Swiped to 1 HP
        return -1;
    } else {
        // Assume we're looking at a percentage of the max HP
        var percent = $("#percent").val();
        if (isNaN(percent) || percent > 100) {
            return 100;
        } else if (percent <= 0) {
            return 1;
        } else {
            return percent;
        }
    }
}
function calc_cur_hp(max_hp) {
    var percent = get_hp();
    if (percent == -1) {
        // False Swiped to 1 HP
        return 1;
    } else {
        return Math.max(1, Math.round(max_hp * percent / 100));
    }
}
function get_hp_bar_class(hp) {
    if (hp < 20) {
        return "low_hp";
    } else if (hp < 50) {
        return "medium_hp";
    } else {
        return "high_hp";
    }
}
function update_hp() {
    var hpfill;
    var color;
    var hp = get_hp();
    if (hp == -1) {
        // False Swiped to 1 HP
        hpfill = 1;
    } else {
        hpfill = Math.ceil(hp / 100 * 48);
    }
    $("#curhp").width(hpfill * 2);
    $("#curhp").attr("class", get_hp_bar_class(hp));
}
function shake_bar(span_class, title, message, chance) {
    var $shake_bar = $("<span></span>").addClass(span_class);
    var msg = '';
    if (message != '') {
        msg = ' - ' + message;
    }
    var percent = show_percent(chance);
    $shake_bar.attr("title", title + ' (' + percent + '%)' + msg).css('width', percent + '%');
    return $shake_bar;
}
function pluralize(num, word, plural_word) {
    if (!plural_word) {
        plural_word = word + "s";
    }
    if (num === 1) {
        return word;
    } else {
        return plural_word;
    }
}
function num_balls(desired_chance, ball_chance) {
    // Calculates the number of balls needed to have at least a desired_chance chance of capturing the Pokémon.
    return Math.ceil(Math.log(1 - desired_chance) / Math.log(1 - ball_chance));
}
function num_balls_message(ball_chance) {
    if (ball_chance === 0) {
        return "Thus, you will never capture it.";
    } else if (ball_chance === 1) {
        return "Thus, you are guaranteed to get it in a single ball.";
    } else {
        var fifty_num_balls = num_balls(0.5, ball_chance);
        
        var ninetyfive_num_balls = num_balls(0.95, ball_chance);
        if (fifty_num_balls == ninetyfive_num_balls) {
            return "Thus, you have at least a 95% chance of catching it within " + ninetyfive_num_balls + " " + pluralize(ninetyfive_num_balls, "ball") + ".";
        } else {
            return "Thus, you have at least a 50% chance of catching it within " + fifty_num_balls + " " + pluralize(fifty_num_balls, "ball") + " and at least a 95% chance of catching it within " + ninetyfive_num_balls + " " + pluralize(ninetyfive_num_balls, "ball") + ".";
        }
    }
}
function write_results(chance_obj, print_chance, extra_message) {
    if (extra_message == undefined) {
        extra_message = "";
    }
    var $results_p = $("<p></p>");
    if (!print_chance) {
        $results_p.html(extra_message);
    } else {
        var $shakebar = $("<div></div>").addClass("shakebar");
        if (chance_obj.critical == 0) {
            $results_p.html("You have a <strong>" + show_percent(chance_obj.success) + "%</strong> chance of capturing it per ball. " + num_balls_message(chance_obj.success) + extra_message);
        } else {
            var finalchance = chance_obj.critical * chance_obj.crit_success + (1 - chance_obj.critical) * chance_obj.success;
            $results_p.html("You have a " + show_percent(chance_obj.critical) + "% chance of a critical capture, which then has a " + show_percent(chance_obj.crit_success) + "% chance of succeeding. Failing that, you have a " + show_percent(chance_obj.success) + "% chance of succeeding with a normal capture. All in all, this amounts to a <strong>" + show_percent(finalchance) + "%</strong> chance per ball. " + num_balls_message(finalchance) + extra_message);
            $shakebar.append(shake_bar('success', 'Successful critical capture', '', chance_obj.critical * chance_obj.crit_success));
            if (chance_obj.crit_success < 1) {
                $shakebar.append(shake_bar('wobble1', 'Failed critical capture', msg[0], chance_obj.critical * (1 - chance_obj.crit_success)));
            }
        }
        $shakebar.append(shake_bar('success', 'Successful capture', '', (1 - chance_obj.critical) * chance_obj.success));
        for (var i = 3; i >= 0; i--) {
            if (chance_obj['wobble' + i] > 0) {
                $shakebar.append(shake_bar('wobble' + i, num_wobbles[i], msg[i], (1 - chance_obj.critical) * chance_obj['wobble' + i]));
            }
        }
        $results.append($shakebar);
    }
    $results.append($results_p);
}
function get_catch_rate(pokemon, ball) {
    return get_pokemon(pokemon, 0).catch_rate;
}
function get_ball_bonus(ball) {
    return 1;
}
function calculate() {
    var pokemon = $("#pokemon").val() * 1;
    var ball = $("#ball").val();
    var form = $("#form").val() * 1 || 0;
    // C value, the Pokémon's catch rate (possibly modified by the ball)
    var c = get_catch_rate(pokemon, ball);
    // B value, the ball bonus
    var b = get_ball_bonus(ball);
    // S value, the status
    var s = status_mods[$("#status").val()];
    // The Pokémon's level
    if ($("#level:focus").val() === "") {
        // The user is probably in the middle of typing a level - just leave everything alone
        return;
    }
    var level = $("#level").val() * 1;
    if (isNaN(level) || Math.floor(level) != level || level < 1 || level > 100) {
        alert("Please enter a valid integer between 1 and 100 as the wild Pokémon's level.");
        $("#level").val(1);
        return false;
    }
    var basehp = get_pokemon(pokemon, form).hp;
    // E value, the Entralink modifier
    var $entralink = $("#entralink");
    var e = 1;
    if ($entralink.length > 0) {
        e = $entralink.val() * 1;
    }
    // Pokédex completion level:
    // Since both the thick grass modifier and the Pokédex modifier in the critical capture chance formula cut along the same lines, i.e. change the modifier between the same values, we can immediately convert the number of caught Pokémon to a "category" for the purposes of the later calculations.
    var $pokedex = $("#pokedex");
    var dexcat = 0;
    if ($pokedex.length > 0) {
        var dex = $pokedex.val() * 1;
        if (dex > 30) {
            dexcat++;
        }
        if (dex > 150) {
            dexcat++;
        }
        if (dex > 300) {
            dexcat++;
        }
        if (dex > 450) {
            dexcat++;
        }
        if (dex > 600) {
            dexcat++;
        }
    }
    // G value, the grass modifier
    var g = 1;
    var gvals = [1229 / 4096, 0.5, 2867 / 4096, 3277 / 4096, 3686 / 4096, 1];
    if ($("#thickgrass").is(":checked")) {
        // In thick grass
        g = gvals[dexcat];
    }
    // P value, the Pokédex modifier
    var pvals = [0, 0.5, 1, 1.5, 2, 2.5];
    var p = pvals[dexcat];
    var details = $("#details").is(":checked");
    function show_results(start_iv, end_iv, chance) {
        if (details) {
            var $results_heading = $("<h4></h4>");
            var iv_string;
            if (start_iv == end_iv) {
                iv_string = start_iv.toString();
            } else {
                iv_string = start_iv + "-" + end_iv;
            }
            $results_heading.text("HP IV of " + iv_string).appendTo($results);
        }
        write_results(chance, chance.success > 0 || !chance.extra_msg, chance.extra_msg);
    }
    $results.html("");
    if (b === -1) {
        // A ball that always succeeds
        var chance_obj = new ChanceObj();
        chance_obj.success = 1;
        show_results(0, max_iv, chance_obj);
        return;
    }
    // Calculate X for every possible IV
    var run_start = 0;
    var last_x = 0;
    var last_chance;
    var x_array = [];
    for (var iv = 0; iv <= max_iv; iv++) {
        // Stat formula for the Pokémon's max HP
        var m;
        if (basehp == 1) {
            // Shedinja always has 1 HP
            m = 1;
        } else {
            m = Math.floor((2 * basehp + (max_iv == 15 ? 2 * iv : iv)) * level / 100 + level + 10);
        }
        var hp = calc_cur_hp(m);
        var x = calc_x(m, hp, c, b, s, g, e);
        if (details) {
            if (iv == 0) {
                last_x = x;
                last_chance = calc_chances([x], c, b, s, p);
            } else if (x != last_x) {
                // This is the end of a run of identical X values; see if the chance itself changed
                var chance = calc_chances([x], c, b, s, p);
                if (chance.comp_val != last_chance.comp_val) {
                    // This is also the end of a run of identical chances
                    show_results(run_start, iv - 1, last_chance);
                    run_start = iv;
                    last_chance = chance;
                }
                last_x = x;
            }
            if (iv == max_iv) {
                show_results(run_start, iv, calc_chances([x], c, b, s, p));
            }
        } else {
            x_array[iv] = x;
        }
    }
    if (!details) {
        show_results(0, max_iv, calc_chances(x_array, c, b, s, p));
    }
// }
// $(document).ready(function() {
//     $results = $("#results");
//     $("#percenthp, #hp1").click(update_hp);
//     $("#percent").keyup(update_hp);
//     $("#hpbar").click(function(event) {
//         var offset_x = event.pageX - $(this).offset().left - $("#curhp").position().left;
//         if (offset_x < 1 && $("#hp1").length > 0) {
//             $("#hp1").prop("checked", true);
//         } else {
//             $("#percent").val(Math.max(1, Math.min(100, Math.round(offset_x * 100 / 96))));
//             $("#percenthp").prop("checked", true);
//         }
//         update_hp();
//         calculate();
//     });
//     $("#pokemon").change(function() {
//         if ($("#form").length === 0) {
//             return;
//         }
//         $("#form").empty();
//         var pokemon = $(this).val();
//         for (var i = 0; i < w[pokemon].length; i++) {
//             if (w[pokemon][i].introduced_in <= version_group) {
//                 $("#form").append('<option value="' + i + '">' + w[pokemon][i].name + '</option>');
//             }
//         }
//         if ($("#form").children().length === 1) {
//             $("#pick-form").hide();
//         } else {
//             $("#pick-form").show();
//         }
//     }).change();
//     $("#calcform input[type=radio], #calcform input[type=checkbox], #calcform select").change(calculate);
//     $("#calcform input[type=text]").keyup(calculate);
//     $(".ball-options").hide().filter("." + $("#ball").val()).show();
//     $("#ball").change(function() {
//         $(".ball-options").hide().filter("." + $("#ball").val()).show();
//     });
//     update_hp();
//     calculate();
// });