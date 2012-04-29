<?php

/**
 * @file
 * This file is empty by default because the base theme chain (Alpha & Omega) provides
 * all the basic functionality. However, in case you wish to customize the output that Drupal
 * generates through Alpha & Omega this file is a good place to do so.
 * 
 * Alpha comes with a neat solution for keeping this file as clean as possible while the code
 * for your subtheme grows. Please read the README.txt in the /preprocess and /process subfolders
 * for more information on this topic.
 */

/**
 * Implements hook_form_alter().
 */
function gottago_form_alter(&$form, &$form_state, $form_id) {
  drupal_add_js(drupal_get_path('theme', 'gottago') .'/js/jquery.html5form.js');
  drupal_add_js(drupal_get_path('theme', 'gottago') .'/js/gottagoForm.js');
}