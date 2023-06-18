'use client'

import React from "react";
import { Navbar, Button, Link, Text, Card, Radio } from "@nextui-org/react";
import { Layout } from "../Lay.js";
import { AcmeLogo } from "../AcmeLogo.js";


export default function Nav() {
  const [variant, setVariant] = React.useState("static");
  const [activeColor, setActiveColor] = React.useState("primary");

  const variants = ["static", "floating", "sticky"];
  
  return (
    <Layout>
      <Navbar isBordered variant={variant}>
        <Navbar.Brand>
          <AcmeLogo />
          <Text b color="inherit" hideIn="xs">
            메인
          </Text>
        </Navbar.Brand>
        <Navbar.Content activeColor={activeColor} hideIn="xs" variant={variant}>
          <Navbar.Link href="/authPage">인증 페이지</Navbar.Link>
          <Navbar.Link href="/list">계좌 목록</Navbar.Link>
          <Navbar.Link href="/voice">보이스피싱 탐지</Navbar.Link>
          <Navbar.Link isActive href="/text">스미싱 탐지</Navbar.Link>
        </Navbar.Content>
        <Navbar.Content>
          <Navbar.Item>
            <Button auto flat as={Link} href="/main">
              Logout
            </Button>
          </Navbar.Item>
        </Navbar.Content>
      </Navbar>
    </Layout>
  )
}
