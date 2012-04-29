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

/**
 * Theme the password description of the user login form
 * and the user login block.
 */
function gottago_lt_password_description($variables) {
  switch ($variables['form_id']) {
    case 'user_login':
      // The password field's description on the /user/login page.
      return l(t('Request new password'), 'user/password');
      break;
  }
}

/**
 * Theme the username description of the user login form
 * and the user login block.
 */
function gottago_lt_username_description($variables) {
  switch ($variables['form_id']) {
    case 'user_login':
      // The username field's description when shown on the /user/login page.
      return '';
      break;
  }
}

/**
 * Theme the username title of the user login form
 * and the user login block.
 */
function gottago_lt_username_title($variables) {
  switch ($variables['form_id']) {
    case 'user_login':
      // Label text for the username field on the /user/login page.
      return t('E-mail address');
      break;

    case 'user_login_block':
      // Label text for the username field when shown in a block.
      return t('E-mail');
      break;
  }
}