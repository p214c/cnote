# Copyright (c) 2013 The Native Client Authors. All rights reserved.
# Use of this source code is governed by a BSD-style license that can be
# found in the LICENSE file.

#
# GNU Make based build file.  For details on GNU Make see:
# http://www.gnu.org/software/make/manual/make.html
#

#
# Get pepper directory for toolchain and includes.
#
# If NACL_SDK_ROOT is not set, then assume it can be found three directories up.
#
THIS_MAKEFILE := $(abspath $(lastword $(MAKEFILE_LIST)))
NACL_SDK_ROOT ?= $(abspath $(dir $(THIS_MAKEFILE))../..)
CRYPTOPP_ROOT ?= $(abspath $(dir $(THIS_MAKEFILE))../cryptopp)
CONFIGURATION = Release

LIB_PATH ?= $(abspath $(dir $(THIS_MAKEFILE))/lib)
INC_PATH ?= $(abspath $(dir $(THIS_MAKEFILE))/include)

# Project Build flags
# Add in -Werror to warnings to fail build if warnings detected
WARNINGS := -Wno-long-long -Wall -Wswitch-enum -pedantic
CXXFLAGS := -pthread -std=gnu++98 $(WARNINGS)

#
# Compute tool paths
#
GETOS := python $(NACL_SDK_ROOT)/tools/getos.py
OSHELPERS := python $(NACL_SDK_ROOT)/tools/oshelpers.py
OSNAME := $(shell $(GETOS))
RM := $(OSHELPERS) rm
MKDIR_P := $(OSHELPERS) mkdir -p

PNACL_TC_PATH := $(abspath $(NACL_SDK_ROOT)/toolchain/$(OSNAME)_pnacl)
PNACL_CXX = $(PNACL_TC_PATH)/bin/pnacl-clang++
PNACL_FINALIZE := $(PNACL_TC_PATH)/bin/pnacl-finalize
CXXFLAGS += -I$(NACL_SDK_ROOT)/include -I$(INC_PATH) -I$(CRYPTOPP_ROOT)
LDFLAGS = -L$(NACL_SDK_ROOT)/lib/pnacl/$(CONFIGURATION) -L$(LIB_PATH) -lppapi_cpp -lppapi -lcryptopp 
#
# Disable DOS PATH warning when using Cygwin based tools Windows
#
CYGWIN ?= nodosfilewarning
export CYGWIN

SRC_DIR := $(abspath ./src/main/cpp)
TST_DIR := $(abspath ./src/test/cpp)
OUT_DIR := $(abspath ./target)/$(CONFIGURATION)

# Declare the ALL target first, to make the 'all' target the default build
all: cnote_encrypt.pexe

crypto:	PNACL_CXX := g++
crypto:	CXXFLAGS := -g -pthread -std=gnu++98 $(WARNINGS) -I$(INC_PATH) -I$(CRYPTOPP_ROOT)
crypto: LDFLAGS := -L$(LIB_PATH) -lgnucryptopp 
crypto: crypt.exe

clean:
	$(RM) -rf base64.o crypt.o cnote_encrypt.bc cnote_encrypt.pexe $(abspath ./target/*)

base64.o: $(SRC_DIR)/base64.cc
	$(MKDIR_P) $(OUT_DIR)
	$(PNACL_CXX) -c -o $(OUT_DIR)/$@ $< -O2 $(CXXFLAGS)

crypt.o: $(SRC_DIR)/crypt.cc
	$(MKDIR_P) $(OUT_DIR)
	$(PNACL_CXX) -c -o $(OUT_DIR)/$@ $< -O2 $(CXXFLAGS)

cnote_encrypt.bc:
	$(MKDIR_P) $(OUT_DIR)
	$(PNACL_CXX) -o $(OUT_DIR)/$@ $(SRC_DIR)/base64.cc $(SRC_DIR)/crypt.cc $(SRC_DIR)/cnote_encrypt.cc -O2 $(CXXFLAGS) $(LDFLAGS)

cnote_encrypt.pexe: cnote_encrypt.bc
	$(PNACL_FINALIZE) -o $(OUT_DIR)/$@ $(OUT_DIR)/$<

cryptTest.o: $(TST_DIR)/cryptTest.cc
	$(PNACL_CXX) -c -o $(OUT_DIR)/$@ $< -O2 $(CXXFLAGS)

crypt.exe: base64.o crypt.o cryptTest.o 
	$(PNACL_CXX) -o $(OUT_DIR)/$@ $(OUT_DIR)/base64.o $(OUT_DIR)/crypt.o $(OUT_DIR)/cryptTest.o $(LDFLAGS)


#
# Makefile target to run the SDK's simple HTTP server and serve this example.
#
HTTPD_PY := python $(NACL_SDK_ROOT)/tools/httpd.py

.PHONY: serve
serve: all
	$(HTTPD_PY) -C $(CURDIR)
	